"""Regenerate web images from the originals in assets/legacy/. Run: python3 scripts/images.py"""
from PIL import Image, ImageOps
L, O = 'assets/legacy/', 'assets/img/'
im = ImageOps.exif_transpose(Image.open(L + 'profile2.jpg')).convert('RGB')
crop = im.crop((550, 500, 2050, 2375))  # head-and-shoulders, 4:5
for w in (480, 720):
    crop.resize((w, w * 5 // 4), Image.LANCZOS).save(f'{O}profile-{w}.webp', quality=80)
for src, name in (('new.png', 'ayu-arana-care'), ('ceylon-traveler1.png', 'ceylon-traveler')):
    x = Image.open(L + src).convert('RGB')
    for w in (480, 960):
        y = x.copy(); y.thumbnail((w, w)); y.save(f'{O}{name}-{w}.webp', quality=78)
        print(name, w, y.size)
