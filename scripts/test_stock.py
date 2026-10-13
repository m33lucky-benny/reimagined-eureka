"""Run: python3 -m unittest scripts/test_stock.py   (publish tests need Pillow)"""
import json
import os
import shutil
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(__file__))
import stock_yaml  # noqa: E402

GALLERY = '''# comment
- file: a-1
  type: "red-devils"
  caption: "Red Devils"
  qty: 4
  date: 2026-10-13
  published: true
- file: "tigers-1"
  type: "fancy-red-tigers"
  caption: "Fancy Red Tigers"
  date: 2026-10-13
  published: true
- file: "tigers-2"
  type: "fancy-red-tigers"
  caption: "Fancy Red Tigers"
  qty: 30
  plus: true
  date: 2026-10-13
  published: true
- file: "kong-1"
  type: "blue-king-kong"
  caption: "Blue King Kong"
  date: 2026-10-11
  published: true
'''


class SetStock(unittest.TestCase):
    def test_every_photo_of_the_type_gets_the_count(self):
        out = stock_yaml.set_stock(GALLERY, "fancy-red-tigers", 12, False)
        self.assertEqual(out.count("qty: 12"), 2)
        self.assertNotIn("plus: true", out)  # the old plus is cleared
        self.assertIn("qty: 4", out)  # other types untouched
        self.assertEqual(out.count("qty:"), 3)
        self.assertTrue(out.startswith("# comment"))

    def test_plus_and_zero(self):
        out = stock_yaml.set_stock(GALLERY, "red-devils", 30, True)
        self.assertIn("qty: 30\n  plus: true", out)
        out = stock_yaml.set_stock(GALLERY, "red-devils", 0, True)
        self.assertIn("qty: 0", out)
        self.assertNotIn("plus: true\n  date: 2026-10-13\n  published: true\n- file: \"tigers-1\"", out)

    def test_unknown_type(self):
        with self.assertRaises(ValueError):
            stock_yaml.set_stock(GALLERY, "nope", 1, False)

    def test_type_stock_is_the_newest_counted(self):
        self.assertEqual(stock_yaml.type_stock(GALLERY, "fancy-red-tigers"), (30, True))
        self.assertEqual(stock_yaml.type_stock(GALLERY, "red-devils"), (4, False))
        self.assertIsNone(stock_yaml.type_stock(GALLERY, "blue-king-kong"))


try:
    from PIL import Image
    import publish_photo
except ImportError:  # pragma: no cover
    Image = None


@unittest.skipIf(Image is None, "Pillow not installed")
class Publish(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()
        os.makedirs(os.path.join(self.d, "repo", "_data"))
        os.makedirs(os.path.join(self.d, "incoming"))
        with open(os.path.join(self.d, "repo", "_data", "gallery.yml"), "w") as f:
            f.write(GALLERY)

    def tearDown(self):
        shutil.rmtree(self.d)

    def publish(self, pid, ptype, **meta):
        Image.new("RGB", (64, 48), (10, 20, 30)).save(os.path.join(self.d, "incoming", pid + ".jpg"), "JPEG")
        m = {"id": pid, "caption": "x", "type": ptype, "received": "2026-10-14T00:00:00Z"}
        m.update(meta)
        with open(os.path.join(self.d, "incoming", pid + ".json"), "w") as f:
            json.dump(m, f)
        publish_photo.publish(pid, os.path.join(self.d, "incoming"), os.path.join(self.d, "repo"))
        with open(os.path.join(self.d, "repo", "_data", "gallery.yml")) as f:
            return f.read()

    def test_new_photo_without_a_number_inherits_the_types_count(self):
        out = self.publish("20261014-000000-aaaaaa", "fancy-red-tigers")
        self.assertEqual(out.count("qty: 30"), 3)  # tigers-1, tigers-2 and the new photo all share it
        self.assertIn('fancy-red-tigers-20261014-000000-aaaaaa', out)

    def test_new_number_applies_to_all_photos_of_the_type(self):
        out = self.publish("20261014-000100-bbbbbb", "red-devils", qty=2)
        self.assertEqual(out.count("qty: 2"), 2)  # old red devils photo + the new one
        self.assertNotIn("qty: 4", out)

    def test_no_number_and_none_known_stays_without_a_count(self):
        out = self.publish("20261014-000200-cccccc", "blue-king-kong")
        tail = out.split("blue-king-kong-20261014-000200-cccccc")[1]
        self.assertNotIn("qty:", tail)


if __name__ == "__main__":
    unittest.main()
