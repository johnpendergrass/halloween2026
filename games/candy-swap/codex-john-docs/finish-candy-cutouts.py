"""Normalize image-tool outputs and build a local review gallery."""
import hashlib
import html
import json
from pathlib import Path
from PIL import Image, ImageDraw

game = Path(__file__).resolve().parents[1]
folder = game / 'assets' / 'candybars'
if not list(folder.glob('*.jpg')):
    raise SystemExit('Historical processing script: originals were moved and assets renamed. Use build-gamedata03.py for the current catalog and gallery.')
processed = folder / 'processed'
processed.mkdir(exist_ok=True)
sources_path = Path(__file__).with_name('candy-cutout-tool-outputs.json')
sources = json.loads(sources_path.read_text(encoding='utf-8')) if sources_path.exists() else {}
default = Image.open(folder / 'default.png').convert('RGBA')
default = default.crop(default.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox())
ratio = 480 / max(default.size)
default = default.resize((round(default.width*ratio), round(default.height*ratio)), Image.Resampling.LANCZOS)
default_canvas = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
default_canvas.paste(default, ((500-default.width)//2, (500-default.height)//2))
default_canvas.save(processed / 'default.png')
records = []
for original in sorted(folder.glob('*.jpg')):
    name = original.stem
    target = processed / (name + '.png')
    if name in sources:
        cutout = Image.open(sources[name]).convert('RGBA')
        bounds = cutout.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        assert bounds, name
        subject = cutout.crop(bounds)
        subject.thumbnail((480, 480), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
        canvas.paste(subject, ((500-subject.width)//2, (500-subject.height)//2))
        canvas.save(target)
    if not target.exists():
        continue
    image = Image.open(target)
    assert image.size == (500, 500) and image.mode == 'RGBA', name
    assert image.getchannel('A').getextrema() == (0, 255), name
    bounds = image.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    assert bounds[0] >= 9 and bounds[1] >= 9 and bounds[2] <= 491 and bounds[3] <= 491, (name, bounds)
    records.append(dict(name=name, graphic='./assets/candybars/processed/'+name+'.png', source=str(original), sourceSHA256=hashlib.sha256(original.read_bytes()).hexdigest(), visibleBounds=bounds, toolOutput=sources.get(name, 'Approved initial sample')))

Path(__file__).with_name('candy-cutouts-manifest.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
template = (game / 'candy-art-preview.html').read_text(encoding='utf-8')
start = template.index('    <div class="grid">')
end = template.index('    <p><a href=', start)
cards = []
for record in records:
    name = html.escape(record['name'])
    graphic = record['graphic']
    cards.append(f'<article class="sample"><h2>{name}</h2><div class="icon-stage"><div class="target"><button aria-label="Select {name}" aria-pressed="false"><img src="{graphic}" alt=""></button></div></div><span class="caption">168 × 168 canvas-pixel touch box</span><div class="big-stage"><img loading="lazy" src="{graphic}" alt="{name} cutout"></div></article>')
template = template[:start] + '    <div class="grid">\n' + '\n'.join(cards) + '\n    </div>\n' + template[end:]
template = template.replace('Candy cutout samples', 'Candy cutout gallery').replace('Tap the small images', f'{len(records)} processed images. Tap the small images')
template = template.replace('<input id="dark" type="checkbox">', '<input id="dark" type="checkbox" checked>')
template = template.replace('<body>', '<body class="dark">')
(game / 'candy-art-gallery.html').write_text(template, encoding='utf-8')
for offset in range(0, len(records), 12):
    page = Image.new('RGB', (1000, 840), '#34213e')
    draw = ImageDraw.Draw(page)
    for index, record in enumerate(records[offset:offset+12]):
        image = Image.open(processed / (record['name']+'.png'))
        image.thumbnail((230, 230), Image.Resampling.LANCZOS)
        x, y = (index % 4)*250, (index // 4)*280
        page.paste(image, (x+10, y+10), image)
        draw.text((x+10, y+248), record['name'], fill='white')
    page.save(Path(__file__).with_name(f'candy-cutouts-sheet-{offset//12+1}.png'))
print(f'Validated {len(records)}/53 cutouts; gallery and dark-background review sheets saved.')
