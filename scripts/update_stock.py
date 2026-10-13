#!/usr/bin/env python3
"""Change the stock count of the newest gallery photo of one type.

Edits _data/gallery.yml in place (text edit: comments and other entries are
left alone). Called by .github/workflows/update-stock.yml when the WhatsApp
Worker receives "red devils 2" with no photo.

Usage: update_stock.py --type red-devils --qty 2 [--plus] [--repo-root .]
Exit codes: 0 updated, 1 bad input or no photo of that type.
"""
import argparse
import os
import re
import sys

TYPE_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
GALLERY = os.path.join("_data", "gallery.yml")


def update_text(text, ptype, qty, plus):
    lines = text.split("\n")
    starts = [i for i, l in enumerate(lines) if re.match(r"^\s*-\s+file:", l)]
    if not starts:
        raise ValueError("no entries in gallery.yml")
    blocks = []
    for n, s in enumerate(starts):
        e = starts[n + 1] if n + 1 < len(starts) else len(lines)
        blocks.append((s, e))

    def entry_type(b):
        for l in lines[b[0]:b[1]]:
            m = re.match(r"^\s*(?:-\s+)?type:\s*[\"']?([a-z0-9-]+)[\"']?\s*$", l)
            if m:
                return m.group(1)
        return None

    def entry_date(b):
        for l in lines[b[0]:b[1]]:
            m = re.match(r"^\s*(?:-\s+)?date:\s*(\d{4}-\d{2}-\d{2})", l)
            if m:
                return m.group(1)
        return ""

    mine = [b for b in blocks if entry_type(b) == ptype]
    if not mine:
        raise ValueError(f"no photo of type {ptype}")
    # newest by date; later in the file wins a tie
    target = max(enumerate(mine), key=lambda t: (entry_date(t[1]), t[0]))[1]
    s, e = target
    body = [l for l in lines[s:e] if not re.match(r"^\s*(?:-\s+)?(qty|plus):", l)]
    ind = re.match(r"^(\s*)-", body[0]).group(1) + "  "
    new = [f"{ind}qty: {qty}"] + ([f"{ind}plus: true"] if plus else [])
    # keep a trailing blank line (if any) after the new lines
    at = len(body)
    while at > 1 and body[at - 1].strip() == "":
        at -= 1
    # insert right after the caption line when present, else at the end of the entry
    cap = next((i for i, l in enumerate(body) if re.match(r"^\s*caption:", l)), None)
    if cap is not None:
        at = cap + 1
    body[at:at] = new
    return "\n".join(lines[:s] + body + lines[e:])


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--type", required=True)
    ap.add_argument("--qty", required=True)
    ap.add_argument("--plus", action="store_true")
    ap.add_argument("--repo-root", default=".")
    a = ap.parse_args(argv)
    if not TYPE_RE.match(a.type) or len(a.type) > 40:
        print("update_stock: bad type", file=sys.stderr)
        return 1
    if not re.fullmatch(r"\d{1,4}", a.qty):
        print("update_stock: qty must be a whole number 0-9999", file=sys.stderr)
        return 1
    path = os.path.join(a.repo_root, GALLERY)
    with open(path, encoding="utf-8") as f:
        text = f.read()
    try:
        out = update_text(text, a.type, int(a.qty), a.plus and int(a.qty) > 0)
    except ValueError as e:
        print(f"update_stock: {e}", file=sys.stderr)
        return 1
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(out)
    os.replace(tmp, path)
    print(f"update_stock: {a.type} qty={a.qty}{'+' if a.plus else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
