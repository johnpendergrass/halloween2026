"""Build the reviewed artwork catalog and apply authorized filename corrections."""
from collections import Counter
from pathlib import Path
import hashlib
import html
import json
from math import comb
from PIL import Image

game = Path(__file__).resolve().parents[1]
assets = game / 'assets'
folder = assets / 'candybars'
# Original filename | stable name | display name | attributes | kind
rows = '''100Grand|100Grand|100 Grand|chocolate caramel rice|candy
3Musketeers|3Musketeers|3 Musketeers|chocolate|candy
AirheadsBites|Airheads|Airheads|fruity chewy|candy
AlmondJoy|AlmondJoy|Almond Joy|chocolate coconut almond|candy
BabyRuth|BabyRuth|Baby Ruth|chocolate peanut caramel|candy
Butterfinger|Butterfinger|Butterfinger|chocolate peanut crunchy|candy
CandyCorn|CandyCorn|Candy Corn|chewy|candy
ChocolateChipCookieHomemade|ChocolateChipCookie|Chocolate-chip Cookie|cookie chocolate|cookie
CookieGhost|GhostCookie|Ghost Cookie|cookie|cookie
CookiePumpkin|PumpkinCookie|Pumpkin Cookie|cookie|cookie
Crayons|Crayons|Crayons|toy|toy
Dots|Dots|Dots|fruity chewy|candy
Eraser|Eraser|Eraser|toy|toy
GumDoubleBubble|DubbleBubble|Dubble Bubble|gum|gum
GumDoubleMint|Doublemint|Doublemint|gum mint|gum
HubbaBubbaFruit|HubbaBubba|Hubba Bubba|gum|gum
GumJuicyFruit|JuicyFruit|Juicy Fruit|gum fruity|gum
OrbitBubblemint|Orbit|Orbit|gum mint lowSugar|gum
TridentWatermelon|Trident|Trident Gum|gum lowSugar|gum
HariboGummies|HariboGoldbears|Haribo Goldbears|fruity chewy|candy
Hersheys|HersheysMilkChocolate|Hershey's Milk Chocolate|chocolate|candy
JollyRancher|JollyRancher|Jolly Rancher|fruity hard|candy
JuniorMints|JuniorMints|Junior Mints|chocolate mint|candy
KitKat|KitKat|Kit Kat|chocolate crunchy|candy
Krackle|Krackel|Krackel|chocolate rice crunchy|candy
LifeSaverGummiesSweet|LifeSaversGummies|Life Savers Gummies|fruity chewy|candy
LifeSavers|LifeSavers|Life Savers|fruity hard|candy
MarsBar|MarsBar|Mars Bar|chocolate caramel|candy
MentosFruit|MentosFruit|Mentos Fruit|fruity chewy|candy
MilkyWay|MilkyWay|Milky Way|chocolate caramel|candy
MMPeanut|MAndMsPeanut|Peanut M&M's|chocolate peanut crunchy|candy
MMPlain|MAndMsMilkChocolate|Milk Chocolate M&M's|chocolate crunchy|candy
Mounds|Mounds|Mounds|chocolate coconut|candy
MrGoodbar|MrGoodbar|Mr. Goodbar|chocolate peanut|candy
Nerds|Nerds|Nerds|fruity crunchy|candy
NestlesCrunch|NestleCrunch|Nestlé Crunch|chocolate rice crunchy|candy
NutsCandybar|NestleNuts|Nestlé Nuts|chocolate peanut caramel|candy
Payday|PayDay|PayDay|peanut caramel|candy
PeanutsPlanters|PlantersPeanuts|Planters Peanuts|peanut crunchy|snack
PlayDoh|PlayDoh|Play-Doh|toy|toy
Popcorn|Popcorn|Popcorn|crunchy|snack
RedVines|RedVines|Red Vines Original Red|chewy|candy
Reeses|ReesesPeanutButterCups|Reese's Peanut Butter Cups|chocolate peanut|candy
RingPopBlueRaspberry|RingPop|Ring Pop|fruity hard|candy
SkittlesSour|SkittlesSour|Skittles Sour|fruity sour chewy|candy
SkittlesSweet|SkittlesOriginal|Skittles Original|fruity chewy|candy
Smarties|Smarties|Smarties|fruity crunchy|candy
Snickers|Snickers|Snickers|chocolate peanut caramel|candy
SourPatch|SourPatchKids|Sour Patch Kids|fruity sour chewy|candy
StarburstOriginal|Starburst|Starburst|fruity chewy|candy
TicTacFruitAdventure|TicTacFruit|Tic Tac Fruit|fruity hard|candy
Twix|Twix|Twix|chocolate cookie caramel|candy
TwizzlersStrawberry|Twizzlers|Twizzlers|fruity chewy|candy
JetPuffedToastedCoconutMarshmallows|JetPuffedToastedCoconutMarshmallows|Jet-Puffed Toasted Coconut Marshmallows|marshmallow coconut|candy
LifeSaversSugarFree|LifeSaversSugarFree|Life Savers Sugar Free|fruity hard lowSugar|candy
LifeSaversMintSugarFree|LifeSaversMintSugarFree|Life Savers Pep-O-Mint Sugar Free|mint hard lowSugar|candy
Mallomars|Mallomars|Mallomars|chocolate marshmallow cookie|cookie
Ohasis|Ohasis|Oh!asis Coconut Patties|chocolate coconut|candy
Peeps|Peeps|Peeps|marshmallow|candy
TootsiePopsCherry|TootsiePopsCherry|Tootsie Pops Cherry|cherry hard chocolate|candy
TootsieRoll|TootsieRoll|Tootsie Roll|chocolate chewy|candy
TwizzlersSugarFree|TwizzlersSugarFree|Twizzlers Sugar Free|fruity chewy lowSugar|candy
WerthersSugarFree|WerthersSugarFree|Werther's Original Sugar Free|caramel hard lowSugar|candy
Whoppers|Whoppers|Whoppers|chocolate crunchy milk|candy'''

definitions = [
 ('chocolate','Chocolate','Chocolate or chocolatey coating is a defining taste.'),
 ('fruity','Fruity','Fruit flavor; an assorted fruit package counts once, without individual flavor tags.'),
 ('sour','Sour','Explicitly sour variety; tangy fruit candy does not automatically qualify.'),
 ('mint','Mint','Recognizable mint flavor; fruit products called mints do not qualify.'),
 ('chewy','Chewy','Soft or chewy non-gum candy; Candy Corn is a deliberate broad texture simplification.'),
 ('hard','Hard','Sucking/lollipop-style hard candy, rather than a crisp candy meant to crumble.'),
 ('crunchy','Crunchy','A defining crisp/crunchy texture: wafers, candy shells, crisped rice, nuts, or popcorn.'),
 ('peanut','Peanut','Peanuts or peanut butter; Nestlé Nuts also uses this game tag by explicit user direction. Not a package ingredient claim.'),
 ('caramel','Caramel','A recognizable caramel component; ordinary sugar is not caramel.'),
 ('cookie','Cookie','Cookies or a cookie/biscuit center. Kit Kat wafer uses Crunchy instead.'),
 ('gum','Gum','Chewing or bubble gum. Omit Chewy to avoid redundant gum texture scoring.'),
 ('toy','Toy','Game shorthand for non-food Halloween treats, including stationery.'),
 ('coconut','Coconut','Recognizable coconut filling; coconut oil alone does not qualify.'),
 ('rice','Rice','Crisped rice in chocolate candy, rather than rice flavor. No implied Crunchy score.'),
 ('lowSugar','Low Sugar','Explicitly sugar-free or zero-sugar varieties. Never infer from serving size or non-food status.'),
 ('almond','Almond','Whole almond filling; a precise, currently rare nut trait.'),
 ('marshmallow','Marshmallow','Marshmallow candy or filling; omit redundant Chewy when this identifies the texture.'),
 ('cherry','Cherry','A specifically cherry-flavored game item. No implied Fruity score.'),
 ('milk','Milk','A distinct milk or malted-milk center, rather than ordinary milk chocolate.')
]
notes = {
 '100Grand': 'Three-tag limit prioritizes Chocolate, Caramel, Rice. Also crunchy in reality; omitted traits never score implicitly.',
 '3Musketeers': 'Chocolate nougat; no Caramel. Nougat omitted rather than adding a narrow preference category.',
 'Airheads': 'Generic Airheads game item; Bites artwork is representative. No Sour tag for the regular item.',
 'CandyCorn': 'Soft candy grouped under Chewy for gameplay; not a claim that its texture equals gummy candy.',
 'GhostCookie': 'Pictured ghost-pattern cookie. Decoration does not establish an additional flavor.',
 'PumpkinCookie': 'Pumpkin-shaped cookie; no pumpkin flavor or chocolate decoration assumed without a recipe.',
 'HubbaBubba': 'Generic bubble gum game item; pictured fruit flavor does not control its tags.',
 'Trident': 'Generic Trident game item. Gum and Low Sugar; no watermelon or Mint tag inferred from representative artwork.',
 'Orbit': 'Generic mint-style, sugar-free Orbit game item; specific Bubblemint wording is not its program identity.',
 'MilkyWay': 'Assumed US-style Milky Way with caramel, matching the pictured branding. Regional varieties can differ.',
 'NestleNuts': 'John explicitly assigns Peanut for the game. Representative real-world product uses hazelnuts; game tags describe the intended game item, not the package recipe.',
 'NestleCrunch': 'Legacy Nestlé wrapper retained; no change to the pictured product branding.',
 'RedVines': 'Original Red variety. Do not infer cherry or black-licorice flavor from its red color or shape; Chewy alone is the conservative assignment.',
 'Nerds': 'Fruity and Crunchy; reserve Sour for explicitly sour varieties.',
 'Smarties': 'US tablet roll, not chocolate Smarties. Crunchy broadly represents its crumbly texture.',
 'Popcorn': 'Plain popcorn assumed; image does not establish caramel coating or a low-sugar claim.',
 'RingPop': 'Generic fruity hard candy item; pictured blue raspberry variety is representative.',
 'AlmondJoy': 'Chocolate, Coconut, Almond. Almond is not Peanut.',
 'JetPuffedToastedCoconutMarshmallows': 'Source filename said Toasted Marshmallow; package identifies Toasted Coconut marshmallows. No chocolate coating on this pictured variety.',
 'LifeSaversMintSugarFree': 'Pep-O-Mint variety shown. Mint, Hard, Low Sugar; no Fruity tag.',
 'Ohasis': 'Generic coconut-patty game item. Limited-edition peppermint artwork is representative; no Mint tag assigned.',
 'Peeps': 'Generic marshmallow Peeps game item, consistent with representative-artwork policy. The pictured chocolate-covered variety does not add Chocolate to this generic item.',
 'TootsiePopsCherry': 'Cherry outer hard candy with chocolatey Tootsie Roll center. Three-tag cap prioritizes Cherry, Hard, Chocolate; Fruity and Chewy do not score implicitly.',
 'Whoppers': 'Chocolatey coating with crunchy malted-milk center. Milk represents the distinct malted-milk taste, not all milk-containing chocolate.'
}
sources = {
 'LifeSaversSugarFree': ['https://www.life-savers.com/'],
 'LifeSaversMintSugarFree': ['https://www.life-savers.com/'],
 'Mallomars': ['https://www.snackworks.com/products/mallomars-pure-chocolate-cookies-82-oz/'],
 'Ohasis': ['https://ohasis.com/'],
 'Peeps': ['https://www.peepsbrand.com/products/classic-marshmallow-chicks/'],
 'TootsiePopsCherry': ['https://shop.tootsie.com/products/tootsie-pops-cherry-flavor'],
 'TootsieRoll': ['https://shop.tootsie.com/collections/best-sellers/products/tootsie-roll-bulk-30-lb-box'],
 'TwizzlersSugarFree': ['https://www.hersheyland.com/brands/zero-sugar.html'],
 'WerthersSugarFree': ['https://www.werthers-original.us/en/products/product-overview'],
 'Whoppers': ['https://www.hersheyland.com/whoppers'],
 'AlmondJoy': ['https://www.hersheyland.com/almond-joy-mounds'],
 'Mounds': ['https://www.hersheyland.com/almond-joy-mounds'],
 'NestleNuts': ['https://www.nestle.de/marken/alle-marken/nuts'],
 'NestleCrunch': ['https://www.crunchbar.com/products/crunch-bar'],
 'Krackel': ['https://www.prnewswire.com/news-releases/the-hershey-company-announces-a-big-comeback-krackel-bar-is-back-the-classic-milk-chocolate-with-crisped-rice-bar-is-once-again-available-in-a-full-size-offering-259944271.html'],
 'Butterfinger': ['https://www.butterfinger.com/'],
 'BabyRuth': ['https://www.ferrerofoodservice.com/us/en/brands/babyruth/babyruth-minis-bulk-30lb'],
 '3Musketeers': ['https://www.3musketeers.com/our-products'],
 'Airheads': ['https://www.airheads.com/candy/'],
 'JuniorMints': ['https://tootsie.com/product-brand/junior-mints/'],
 'MilkyWay': ['https://www.milkywaybar.com/'],
 'MrGoodbar': ['https://www.hersheyland.com/products/hersheys-mr-goodbar-chocolate-with-peanuts-candy-bar-1-75-oz.html'],
 'Orbit': ['https://www.orbitgum.com/orbit-bubblemint-gum'],
 'Trident': ['https://www.tridentgum.com/products/trident-watermelon-twist-14-pieces'],
 'RedVines': ['https://redvines.com/faq/']
}
items, renames = [], []
rename_log = Path(__file__).with_name('candy-filename-renames-2026-1007.json')
rename_history = json.loads(rename_log.read_text(encoding='utf-8')) if rename_log.exists() else []
for row in rows.splitlines():
    old, name, display, tags, kind = row.split('|')
    source, target = folder / (old+'.png'), folder / (name+'.png')
    if source.name != target.name and source.exists():
        case_only = source.name.casefold() == target.name.casefold()
        assert case_only or not target.exists(), f'Rename collision: {target}'
        before = hashlib.sha256(source.read_bytes()).hexdigest()
        if case_only:
            temporary = folder / (name+'.rename-tmp.png')
            assert not temporary.exists(), temporary
            source.rename(temporary)
            temporary.rename(target)
        else:
            source.rename(target)
        assert hashlib.sha256(target.read_bytes()).hexdigest() == before
    assert target.exists(), target
    if old != name:
        renames.append({'from':old+'.png','to':name+'.png'})
    with Image.open(target) as image:
        size = dict(width=image.width, height=image.height)
    item = dict(name=name, displayName=display, fileName=target.name, imageSize=size, attributes=tags.split(), kind=kind, graphic='./assets/candybars/'+target.name, enabled=True)
    if name in notes: item['notes'] = notes[name]
    if name in sources: item['sources'] = sources[name]
    items.append(item)

assert len(items) == 64
assert len({i['name'].casefold() for i in items}) == 64
assert {p.name for p in folder.glob('*.png')} == {i['fileName'] for i in items} | {'default.png'}
counts = Counter(t for item in items for t in item['attributes'])
attributes = [dict(id=id, label=label, description=description, itemCount=counts[id], preferenceUse='planned' if counts[id]==0 else 'broad' if counts[id]>=6 else 'specialty') for id,label,description in definitions]
allowed = {a['id'] for a in attributes}
assert all(1 <= len(i['attributes']) <= 3 and set(i['attributes']) <= allowed for i in items)
previous = json.loads((assets/'gamedata02.json').read_text(encoding='utf-8'))
characters = previous['characters']
for character in characters:
    for preference in character['preferences']:
        if preference['attribute'] == 'minty': preference['attribute'] = 'mint'
    character['notes'] = 'Retained demo preferences for comparison; see candidateProfiles for the new broad-pool proposal.'
candidate = [('jing','Jing','chocolate','cookie','mint'),('yuze','Yuze','chewy','caramel','gum'),('andries','Andries','crunchy','gum','peanut'),('noor','Noor','fruity','toy','sour')]
candidate_profiles = [dict(id=id,name=name,profileStatus='proposal-not-active',preferences=[dict(attribute=t,level=l) for t,l in zip((favorite,like,dislike),('favorite','like','dislike'))]) for id,name,favorite,like,dislike in candidate]
data = dict(schemaVersion=2,status='reviewed-catalog-and-profile-proposal',title='Candy Swap — Game Data 03',identityField='name',graphicPathBase='game-directory',defaultGraphic='./assets/candybars/default.png',defaultImageSize=dict(width=Image.open(folder/'default.png').width,height=Image.open(folder/'default.png').height),rules=previous['rules'],attributes=attributes,reservedAttributes=[],items=items,characters=characters,candidateProfiles=candidate_profiles)
data['rules']['notes'] = 'Base +1 plus matching preference adjustments; raw totals, no timer. Only displayed attributes score, with no implied parent matching. Sweetness assumed for candy. Low Sugar currently requires explicit sugar-free packaging. No current profile uses strong dislikes.'
data['attributeBasis'] = 'game-design'
data['artworkIsRepresentative'] = True
data['suggestedAdditions'] = [
 dict(name='Warheads',displayName='Warheads Hard Candy',attributes=['fruity','sour','hard'],status='needs-artwork',source='https://warheads.com/warheads/')
]
(assets/'gamedata03.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for change in renames:
    if change not in rename_history: rename_history.append(change)
rename_log.write_text(json.dumps(rename_history,indent=2)+'\n',encoding='utf-8')
lines = ['CANDY SWAP — GAME DATA 03','Reviewed artwork catalog and preference proposal — 2026-10-07','Companion: gamedata03.json','', 'IDENTITY','name is a unique, stable program key; displayName is UI text; fileName is the actual filename.','Names use PascalCase, with numeric brand names retained as string keys (100Grand, 3Musketeers).','Image dimensions are measured pixels, not CSS size. Default graphic is a fallback, not a candy.','', 'MATCHING AND SIMPLICITY','One to three visible scoring traits per item; do not fill a quota.','Candy is assumed sweet. Fruity and Sour can still be sweet.','Use identical attribute IDs for candy and character preferences.','Only explicit tags match; Rice does not automatically match Crunchy.','Gum does not also get Chewy; Peanut includes peanut butter but not other nuts.','Traits are gameplay descriptions, not exhaustive ingredient or dietary records.','', 'SHARED ATTRIBUTES / COVERAGE (64 ITEMS)']
for attribute in attributes:
    k=attribute['itemCount']
    chance=(1-comb(len(items)-k,6)/comb(len(items),6))*100
    lines += [f"{attribute['id']:12} {attribute['label']:12} {k:2} items; {chance:.0f}% chance in a uniform six-item deal.", '  '+attribute['description']]
lines += ['', 'REPRESENTATIVE ARTWORK','John clarified that pictures need not match the exact intended variety.','Tags describe the game item, not every ingredient or flavor printed on its picture.','Trident is generic Gum; NestleNuts uses Peanut by explicit user direction.','', 'PLANNED / RESERVED','Marshmallow: now represented by Peeps, Mallomars and Jet-Puffed Toasted Coconut Marshmallows.','Cherry: Tootsie Pops Cherry qualifies; no automatic Fruity matching.','Milk: Whoppers has a distinct malted-milk center; ordinary milk chocolate stays Chocolate.','Low Sugar: six explicitly sugar-free items, including gums, hard candies and twists.','Rice: crisped rice, not a distinct rice flavor; retain as a specialty preference.','Almond: appears once; avoid as an initial favorite.','', 'FULL ARTWORK CATALOG']
labels={a['id']:a['label'] for a in attributes}
for item in items:
    lines += [f"{item['name']} | {item['displayName']} | {item['fileName']} | {item['imageSize']['width']}x{item['imageSize']['height']} | "+', '.join(labels[t] for t in item['attributes'])]
    if 'notes' in item: lines.append('  Note: '+item['notes'])
lines += ['', 'PLAYER PREFERENCE DIRECTION','Keep three lines: favorite +2, like +1, dislike -1; base +1 per item.','Strong dislike -2 remains supported for later; none assigned.','The existing profiles are retained in characters, not silently replaced.','candidateProfiles proposes broader favorites for the full artwork pool:']
for id,name,favorite,like,dislike in candidate:
    lines.append(f'{name}: favorite {labels[favorite]}; like {labels[like]}; dislike {labels[dislike]}.')
lines += ['Andries still dislikes Peanut, as confirmed.','Sour has only two items; Cherry, Milk and Almond each have one. These work better as','secondary preferences or in deliberately balanced deals than as random-pool favorites.','Marshmallow and Coconut remain specialty traits. Broad favorites help each character find useful trades.','Noor liking Toy creates an interested recipient for all three non-food treats.','', 'STATUS','Catalog covers the current 64 artwork files, with corrected identities and paths.','Items without artwork from the old draft (Mentos Mint, Ruler, Toy Spider) are not in this catalog.','The live demo reads gamedata03.json with retained character profiles; candidateProfiles are proposals.','Research, naming decisions and coverage: ../codex-john-docs/gamedata03-handoff-2026-1007.md']
lines += ['', 'GAPS / POSSIBLE NEW ITEMS','Marshmallow is now covered. Warheads hard candy would add Fruity + Sour + Hard.','The remaining suggested addition is not in the dealable catalog and needs artwork.','Prefer new tag combinations and support for rare traits over more equivalent chocolate bars.']
(assets/'gamedata03.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')

# Repair preview references after the user's move and the authorized renames.
for page_name in ('candy-art-preview.html','candy-art-gallery.html'):
    page=game/page_name
    text=page.read_text(encoding='utf-8').replace('./assets/candybars/processed/','./assets/candybars/')
    for change in renames:
        text=text.replace('./assets/candybars/'+change['from'],'./assets/candybars/'+change['to'])
    if page_name=='candy-art-gallery.html':
        import re
        text=re.sub(r'\d+ processed images\.',f'{len(items)} processed images.',text)
        start=text.index('    <div class="grid">')
        end=text.index('    <p><a href=',start)
        cards=[]
        for item in items:
            display=html.escape(item['displayName'])
            graphic=item['graphic']
            tags=html.escape(', '.join(labels[tag] for tag in item['attributes']))
            cards.append(f'<article class="sample"><h2>{display}</h2><div class="icon-stage"><div class="target"><button aria-label="Select {display}" aria-pressed="false"><img src="{graphic}" alt=""></button></div></div><span class="caption">168 × 168 canvas-pixel touch box</span><div class="big-stage"><img loading="lazy" src="{graphic}" alt="{display} cutout"></div><span class="caption">{tags}</span></article>')
        text=text[:start]+'    <div class="grid">\n'+'\n'.join(cards)+'\n    </div>\n'+text[end:]
    page.write_text(text,encoding='utf-8')
print(json.dumps(dict(items=len(items),renames=len(renames),coverage=dict(counts)),indent=2))
