#!/usr/bin/env python3
"""Publish one WhatsApp photo to the site.

Reads incoming/<id>.<ext> and incoming/<id>.json from a checkout of the
`incoming` branch, re-encodes the photo (rotation applied, ALL metadata
dropped), writes the full-size and 320/640 px copies, appends an entry to
_data/gallery.yml, then deletes the incoming files. Safe to run twice.

Only dependency: Pillow.

Usage: publish_photo.py --id <id> [--incoming-dir incoming] [--repo-root .]
Exit codes: 0 done (or already done), 1 bad input / nothing to publish,
            2 not a usable image.
"""
import argparse
import datetime
import glob
import json
import os
import re
import sys

from stock_yaml import set_stock, type_stock

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    print("Pillow is required: pip install pillow", file=sys.stderr)
    raise

ID_RE = re.compile(r"^\d{8}-\d{6}-[0-9a-f]{6}$")
TYPE_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MAX_CAPTION = 120
MAX_INPUT_BYTES = 12 * 1024 * 1024
LONG_EDGE = 2048
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
Image.MAX_IMAGE_PIXELS = 60_000_000  # decompression-bomb guard (raises above 2x this)

GALLERY = os.path.join("_data", "gallery.yml")
FULL_DIR = os.path.join("assets", "shrimps")
OPT_DIR = os.path.join("assets", "shrimps-optimized")


class PublishError(Exception):
    def __init__(self, msg, code=1):
        super().__init__(msg)
        self.code = code


# ---- text helpers ---------------------------------------------------------

def sanitise_caption(value, limit=MAX_CAPTION):
    """Same rules as the Worker: no control chars, no markup characters."""
    if not isinstance(value, str):
        return ""
    t = re.sub(r"[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2060\ufeff]", " ", value)
    t = t.replace("$(", "(")
    t = re.sub(r"[<>{}`\\]", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) > limit:
        t = t[:limit].strip()
    return t


def yaml_quote(value):
    s = json.dumps(str(value), ensure_ascii=False)
    return s.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def stock_lines(ind, entry):
    """Optional stock count: `qty` (0 = sold out) and `plus` (30+ means at least 30)."""
    qty = entry.get("qty")
    if qty is None:
        return ""
    out = f"{ind}  qty: {int(qty)}\n"
    if entry.get("plus"):
        out += f"{ind}  plus: true\n"
    return out


def append_gallery_yaml(existing, entry):
    """Append one entry, leaving existing text (comments, entries) untouched."""
    lines = existing.split("\n")
    first = next((l for l in lines if l.strip() and not l.strip().startswith("#")), None)
    if first is not None and not re.match(r"^\s*-(\s|$)", first) and first.strip() != "[]":
        raise PublishError("gallery.yml is not a top-level list; refusing to edit it")
    m = re.search(r"^(\s*)-\s+\S+:", existing, re.M)
    ind = m.group(1) if m else ""
    block = (
        f"{ind}- file: {yaml_quote(entry['file'])}\n"
        f"{ind}  type: {yaml_quote(entry['type'])}\n"
        f"{ind}  caption: {yaml_quote(entry['caption'])}\n"
        f"{stock_lines(ind, entry)}"
        f"{ind}  date: {entry['date']}\n"
        f"{ind}  published: {'true' if entry.get('published', True) else 'false'}\n"
    )
    if first is not None and first.strip() == "[]":
        lines.remove(first)
        existing = "\n".join(lines)
    if existing and not existing.endswith("\n"):
        existing += "\n"
    return existing + block


def already_in_gallery(text, filename):
    pat = r"^\s*(?:-\s+)?file:\s*[\"']?" + re.escape(filename) + r"[\"']?\s*$"
    return re.search(pat, text, re.M) is not None


# ---- image ----------------------------------------------------------------

def load_clean_image(path):
    size = os.path.getsize(path)
    if size > MAX_INPUT_BYTES:
        raise PublishError(f"{os.path.basename(path)} is larger than {MAX_INPUT_BYTES} bytes", 2)
    try:
        with Image.open(path) as probe:
            fmt = probe.format
            probe.verify()
        if fmt not in ALLOWED_FORMATS:
            raise PublishError(f"unsupported image format: {fmt}", 2)
        with Image.open(path) as im:
            im.load()
            im = ImageOps.exif_transpose(im)  # rotate first, then drop metadata
            if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
                rgba = im.convert("RGBA")
                bg = Image.new("RGB", rgba.size, (255, 255, 255))
                bg.paste(rgba, mask=rgba.getchannel("A"))
                rgb = bg
            else:
                rgb = im.convert("RGB")
            clean = Image.new("RGB", rgb.size)  # fresh image: no info, no exif, no icc
            clean.paste(rgb)
            return clean
    except PublishError:
        raise
    except Exception as e:  # corrupt, HEIC, truncated, bomb ...
        raise PublishError(f"not a usable JPEG/PNG/WebP image: {type(e).__name__}", 2)


def save_jpeg(im, path, max_long=None, width=None):
    out = im
    if width is not None and im.width > width:
        out = im.resize((width, max(1, round(im.height * width / im.width))), Image.LANCZOS)
    elif max_long is not None and max(im.size) > max_long:
        out = im.copy()
        out.thumbnail((max_long, max_long), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, "JPEG", quality=85, optimize=True, progressive=True)


# ---- main flow --------------------------------------------------------------

def find_photo(incoming_dir, pid):
    cands = sorted(p for p in glob.glob(os.path.join(incoming_dir, pid + ".*")) if not p.endswith(".json"))
    return cands[0] if cands else None


def publish(pid, incoming_dir="incoming", repo_root=".", today=None):
    if not ID_RE.match(pid or ""):
        raise PublishError("unsafe or malformed id")
    gallery_path = os.path.join(repo_root, GALLERY)
    gallery_text = ""
    if os.path.exists(gallery_path):
        with open(gallery_path, encoding="utf-8") as f:
            gallery_text = f.read()

    meta_path = os.path.join(incoming_dir, pid + ".json")
    photo_path = find_photo(incoming_dir, pid)

    if not os.path.exists(meta_path) or photo_path is None:
        # Already done? (idempotent second run)
        if re.search(r"^\s*(?:-\s+)?file:\s*[\"']?[a-z0-9-]*" + re.escape(pid) + r"[\"']?\s*$", gallery_text, re.M):
            return "already-published"
        raise PublishError(f"no incoming files for {pid}")

    with open(meta_path, encoding="utf-8") as f:
        try:
            meta = json.load(f)
        except ValueError:
            raise PublishError("incoming json is not valid JSON")
    if not isinstance(meta, dict):
        raise PublishError("incoming json is not an object")
    ptype = meta.get("type")
    if not isinstance(ptype, str) or not TYPE_RE.match(ptype) or len(ptype) > 40:
        raise PublishError("no valid type chosen for this photo; not publishing")
    if meta.get("id") not in (None, pid):
        raise PublishError("id in json does not match")
    caption = sanitise_caption(meta.get("caption", ""))
    qty = meta.get("qty")
    if isinstance(qty, bool) or not isinstance(qty, int) or not 0 <= qty <= 9999:
        qty = None
    plus = meta.get("plus") is True and qty is not None

    received = str(meta.get("received", ""))
    m = re.match(r"^(\d{4}-\d{2}-\d{2})", received)
    date = m.group(1) if m else (today or datetime.date.today().isoformat())
    try:
        datetime.date.fromisoformat(date)
    except ValueError:
        date = today or datetime.date.today().isoformat()

    slug = f"{ptype}-{pid}"
    filename = slug + ".jpg"

    im = load_clean_image(photo_path)
    save_jpeg(im, os.path.join(repo_root, FULL_DIR, filename), max_long=LONG_EDGE)
    save_jpeg(im, os.path.join(repo_root, OPT_DIR, f"{slug}-320.jpg"), width=320)
    save_jpeg(im, os.path.join(repo_root, OPT_DIR, f"{slug}-640.jpg"), width=640)

    # The site template appends ".jpg" and "-320.jpg" itself, so `file` is the bare slug.
    if not already_in_gallery(gallery_text, slug):
        if qty is None:
            inherited = type_stock(gallery_text, ptype)  # same type, same count
            if inherited:
                qty, plus = inherited
        new_text = append_gallery_yaml(
            gallery_text,
            {"file": slug, "type": ptype, "caption": caption, "qty": qty, "plus": plus, "date": date, "published": True},
        )
        if qty is not None:
            new_text = set_stock(new_text, ptype, qty, plus)  # a new number applies to every photo of the type
        os.makedirs(os.path.dirname(gallery_path), exist_ok=True)
        tmp = gallery_path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(new_text)
        os.replace(tmp, gallery_path)

    for p in (photo_path, meta_path):
        try:
            os.remove(p)
        except FileNotFoundError:
            pass
    return "published"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--id", required=True)
    ap.add_argument("--incoming-dir", default="incoming")
    ap.add_argument("--repo-root", default=".")
    a = ap.parse_args(argv)
    try:
        result = publish(a.id, a.incoming_dir, a.repo_root)
    except PublishError as e:
        print(f"publish_photo: {e}", file=sys.stderr)
        return e.code
    print(f"publish_photo: {result} {a.id}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
