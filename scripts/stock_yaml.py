"""Stock count helpers for _data/gallery.yml (plain text edits, nothing else is touched).

The count belongs to the TYPE: every photo of a type shows the same number.
`qty` is the number available (0 = sold out); `plus: true` means "at least".
"""
import re

_FILE = re.compile(r"^\s*-\s+file:")
_KV = re.compile(r"^\s*(?:-\s+)?(qty|plus|type|caption|date):\s*(.*?)\s*$")


def _blocks(lines):
    starts = [i for i, l in enumerate(lines) if _FILE.match(l)]
    return [(s, starts[n + 1] if n + 1 < len(starts) else len(lines)) for n, s in enumerate(starts)]


def _field(lines, block, name):
    for l in lines[block[0]:block[1]]:
        m = _KV.match(l)
        if m and m.group(1) == name:
            return m.group(2).strip("\"'")
    return None


def type_stock(text, ptype):
    """(qty, plus) of the newest photo of this type that has a count, else None."""
    lines = text.split("\n")
    found = None
    for b in _blocks(lines):
        if _field(lines, b, "type") != ptype:
            continue
        q = _field(lines, b, "qty")
        if q is not None and re.fullmatch(r"\d{1,4}", q):
            found = (int(q), _field(lines, b, "plus") == "true")
    return found


def set_stock(text, ptype, qty, plus):
    """Give EVERY photo of this type the same count. Raises ValueError if there is none."""
    lines = text.split("\n")
    mine = [b for b in _blocks(lines) if _field(lines, b, "type") == ptype]
    if not mine:
        raise ValueError(f"no photo of type {ptype}")
    plus = bool(plus) and qty > 0
    for s, e in reversed(mine):  # bottom-up so earlier indexes stay valid
        body = [l for l in lines[s:e] if not re.match(r"^\s*(?:-\s+)?(qty|plus):", l)]
        ind = re.match(r"^(\s*)-", body[0]).group(1) + "  "
        new = [f"{ind}qty: {qty}"] + ([f"{ind}plus: true"] if plus else [])
        at = next((i for i, l in enumerate(body) if re.match(r"^\s*caption:", l)), None)
        at = at + 1 if at is not None else len(body)
        body[at:at] = new
        lines[s:e] = body
    return "\n".join(lines)
