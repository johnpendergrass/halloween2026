// Enter gameplay through the opening spinner. Optional actor controls fixtures.
module.exports = async function startRound(surface, actor) {
  const message = surface.locator('#message');
  await surface.locator('.opening-action').waitFor();
  if (actor) await message.evaluate((node, role) => {
    window.openingTestRandom = Math.random;
    Math.random = () => role === 'human' ? .25 : .75;
  }, actor);
  await message.click();
  await surface.locator('.starter-chosen').waitFor();
  if (actor) await message.evaluate(() => { Math.random = window.openingTestRandom; delete window.openingTestRandom; });
  await message.click();
};
