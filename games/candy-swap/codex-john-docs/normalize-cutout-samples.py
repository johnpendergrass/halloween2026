"""Size image-tool cutouts; does not remove backgrounds from source photographs."""
import json
import sys
from pathlib import Path
from PIL import Image

destination = Path(__file__).resolve().parents[1] / 'assets' / 'candybars'
manifest = []
for argument in sys.argv[1:]:
    name, source = argument.split('=', 1)
    cutout = Image.open(source).convert('RGBA')
    # Ignore nearly invisible alpha speckles when locating the subject.
    bounds = cutout.getchannel('A').point(lambda alpha: 255 if alpha > 8 else 0).getbbox()
    if not bounds:
        raise ValueError(f'No visible subject: {source}')
    subject = cutout.crop(bounds)
    subject.thumbnail((480, 480), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
    canvas.paste(subject, ((500 - subject.width) // 2, (500 - subject.height) // 2))
    output = destination / f'{name}.png'
    canvas.save(output)
    manifest.append(dict(name=name, toolOutput=source, crop=bounds, subjectSize=subject.size, output=str(output)))
    print(f'{name}: {subject.width}x{subject.height} on transparent 500x500')
Path(__file__).with_name('cutout-samples-manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
