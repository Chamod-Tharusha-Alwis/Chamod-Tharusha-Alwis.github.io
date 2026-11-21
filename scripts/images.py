"""Regenerate web images from the originals in assets/legacy/. Run: python3 scripts/images.py"""
from PIL import Image, ImageOps
L, O = 'assets/legacy/', 'assets/img/'
im = ImageOps.exif_transpose(Image.open(L + 'profile2.jpg')).convert('RGB')
for w in (480, 720):  # full, uncropped photo (3:4)
    im.resize((w, round(w * im.size[1] / im.size[0])), Image.LANCZOS).save(f'{O}profile-full-{w}.webp', quality=80, method=6)
for src, name in (('new.png', 'ayu-arana-care'), ('ceylon-traveler1.png', 'ceylon-traveler')):
    x = Image.open(L + src).convert('RGB')
    for w in (480, 960):
        y = x.copy(); y.thumbnail((w, w)); y.save(f'{O}{name}-{w}.webp', quality=78)
        print(name, w, y.size)
