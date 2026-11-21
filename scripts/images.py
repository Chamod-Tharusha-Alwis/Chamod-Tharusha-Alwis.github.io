"""Regenerate web images from the originals in assets/legacy/. Run: python3 scripts/images.py"""
from PIL import Image, ImageOps
L, O = 'assets/legacy/', 'assets/img/'
im = ImageOps.exif_transpose(Image.open(L + 'profile2.jpg')).convert('RGB')
for w in (480, 720):  # full, uncropped photo (3:4)
    im.resize((w, round(w * im.size[1] / im.size[0])), Image.LANCZOS).save(f'{O}profile-full-{w}.webp', quality=80, method=6)
for src, name, box in (('new.png', 'ayu-arana-care', None), ('ceylon-traveler2.png', 'ceylon-traveler', (0, 0, 1908, 730))):  # Ceylon: crop below y=730 removes the rating badge
    x = Image.open(L + src).convert('RGB')
    if box: x = x.crop(box)
    for w in (480, 960):
        y = x.copy(); y.thumbnail((w, w)); y.save(f'{O}{name}-{w}.webp', quality=78, method=6)
        print(name, w, y.size)

# MediSync screenshots (originals in assets/legacy/). Landing: crop below y=680 removes the cut-off "Interactive Workflows" box.
# Doctor portal: crop below y=862 removes the "commit fd71d33" line.
for src, name, box in (('medisync-public-health.png', 'medisync-public-health', None),
                       ('medisync-landing.png', 'medisync-landing', (0, 0, 1903, 680)),  # crop just below the two buttons
                       ('medisync-doctor-portal.png', 'medisync-doctor-portal', (0, 0, 1908, 862))):
    x = Image.open(L + src).convert('RGB')
    if box: x = x.crop(box)
    for w in (480, 960, 1440):
        y = x.resize((w, round(w * x.size[1] / x.size[0])), Image.LANCZOS)
        y.save(f'{O}{name}-{w}.webp', quality=80, method=6)
        print(name, w, y.size)
