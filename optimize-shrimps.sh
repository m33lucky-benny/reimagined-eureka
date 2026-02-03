#!/usr/bin/env bash
set -e

SRC_DIR="assets/shrimps"
OUT_DIR="assets/shrimps-optimized"

mkdir -p "$OUT_DIR"

for f in "$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg "$SRC_DIR"/*.JPG; do
  [ -e "$f" ] || continue

  base="$(basename "$f")"
  name="${base%.*}"          # e.g. blue-bolt

  # 320px wide JPG + WebP
  magick "$f" -resize 320 -quality 80 "$OUT_DIR/${name}-320.jpg"
  magick "$f" -resize 320 -quality 80 "$OUT_DIR/${name}-320.webp"

  # 640px wide JPG + WebP
  magick "$f" -resize 640 -quality 80 "$OUT_DIR/${name}-640.jpg"
  magick "$f" -resize 640 -quality 80 "$OUT_DIR/${name}-640.webp"

  echo "Processed $base"
done