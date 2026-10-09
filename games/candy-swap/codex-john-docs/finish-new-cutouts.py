"""Normalize imagegen outputs and verify the new source images are preserved."""
import hashlib
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw

docs = Path(__file__).resolve().parent
game = docs.parent
originals = game / 'assets' / 'original candybar images - not processed'
destination = game / 'assets' / 'candybars'
names = {
 'JetPuffedToastedMarshmallow':'JetPuffedToastedCoconutMarshmallows',
 'LifeSavers-SugarFree':'LifeSaversSugarFree',
 'LifeSaversMint-SugarFree':'LifeSaversMintSugarFree',
 'Mallowmars':'Mallomars', 'Ohasis':'Ohasis', 'Peeps':'Peeps',
 'TootsiePopsCherry':'TootsiePopsCherry', 'TootsieRoll':'TootsieRoll',
 'Twizzlers-SugarFree':'TwizzlersSugarFree',
 'Werthers-SugarFree':'WerthersSugarFree', 'Whoppers':'Whoppers'
}
manifest = []
sheet = Image.new('RGB', (1000, 900), '#17202b')
draw = ImageDraw.Draw(sheet)
for index, (source_name, name) in enumerate(names.items()):
    source = originals / ('_'+source_name+'.jpg')
    progress = json.loads((docs / ('new-cutout-progress-'+source_name+'.json')).read_text())
    raw = Path(progress['path'] if 'path' in progress else re.search(r'as (.+?\.png) by default',progress['hint']).group(1))
    im = Image.open(raw).convert('RGBA')
    bounds = im.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
    assert bounds, raw
    subject = im.crop(bounds)
    subject.thumbnail((480,480), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA',(500,500),(0,0,0,0))
    canvas.paste(subject, ((500-subject.width)//2,(500-subject.height)//2))
    output = destination / (name+'.png')
    canvas.save(output)
    assert canvas.getchannel('A').getextrema()[0] == 0
    bbox = canvas.getchannel('A').point(lambda a:255 if a>8 else 0).getbbox()
    assert bbox[0]>=9 and bbox[1]>=9 and bbox[2]<=491 and bbox[3]<=491, bbox
    manifest.append(dict(name=name, original=str(source), originalSHA256=hashlib.sha256(source.read_bytes()).hexdigest(), toolOutput=str(raw), output=str(output), imageSize={'width':500,'height':500}, subjectBounds=bbox))
    preview = canvas.resize((235,235),Image.Resampling.LANCZOS)
    x,y = (index%4)*250, (index//4)*300
    sheet.paste(preview,(x+7,y+5),preview)
    draw.text((x+7,y+245),name,fill='white')
sheet.save(docs/'new-candy-cutouts-review.png')
(docs/'new-candy-cutouts-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('PASS: 11 transparent 500x500 cutouts, centered with padding.')
