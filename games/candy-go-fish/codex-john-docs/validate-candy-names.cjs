// Check the whole catalog, not just the types selected for a particular round.
const normalize = text => text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
function validateCandyNames(candies) {
  const ids = new Set(), names = new Map();
  for (const candy of candies) {
    if (!candy.id || ids.has(candy.id)) throw new Error('Missing or duplicate candy id: ' + candy.id);
    ids.add(candy.id);
    for (const field of ['longName', 'shortName']) {
      if (typeof candy[field] !== 'string' || !candy[field].trim() || candy[field] !== candy[field].trim()) {
        throw new Error(candy.id + ' needs a nonempty, trimmed ' + field);
      }
    }
    if ([...candy.shortName].length > 16) throw new Error(candy.id + ': shortName exceeds 16 characters');
    const key = normalize(candy.shortName);
    if (!key) throw new Error(candy.id + ': shortName needs letters or numbers');
    if (names.has(key)) throw new Error('Conflicting shortName: ' + candy.shortName + ' (' + names.get(key) + ', ' + candy.id + ')');
    names.set(key, candy.id);
  }
}
module.exports = validateCandyNames;
if (require.main === module) {
  const assert = require('node:assert/strict');
  const config = require('../assets/json/game-config.json');
  validateCandyNames(config.candies);
  const first = { id: 'first', longName: 'Example Candy', shortName: 'Candy Bar' };
  assert.throws(() => validateCandyNames([first, { ...first, id: 'second', shortName: 'CANDY-BAR' }]), /Conflicting/);
  assert.throws(() => validateCandyNames([{ ...first, shortName: 'This name is too long' }]), /16 characters/);
  assert.throws(() => validateCandyNames([{ ...first, longName: '' }]), /longName/);
  console.log('Catalog names, normalized conflicts, required fields and length limit passed.');
}
