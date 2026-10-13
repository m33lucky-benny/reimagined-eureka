#!/usr/bin/env python3
"""Change the stock count of a type: every gallery photo of that type shows the new number.

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

from stock_yaml import set_stock

TYPE_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
GALLERY = os.path.join("_data", "gallery.yml")


def update_text(text, ptype, qty, plus):
    """Every photo of the type gets the same count."""
    return set_stock(text, ptype, qty, plus)


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
