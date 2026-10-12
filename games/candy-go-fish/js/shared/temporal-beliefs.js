(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const knowledge = node ? require('./knowledge') : root.OpponentKnowledge;
  function beliefs(view, random, options = {}) {
    const count = options.particles || 1024, memory = view.memory, types = view.candyTypes;
    if (!memory.initialHand || !memory.transitions) return knowledge.beliefs(view);
    let model = memory.temporal;
    function fromCurrent() {
      const current = knowledge.beliefs(view);
      return Array.from({ length: count }, () => {
        const sample = current.sample(random);
        return { opponent: Int8Array.from(types.map(type => sample.opponent[type])), dish: Int8Array.from(types.map(type => sample.dish[type])) };
      });
    }
    if (!model) {
      const own = knowledge.counts(memory.initialHand), available = types.map(type => view.copiesPerType - (own[type] || 0));
      const particles = [];
      for (let trial = 0; particles.length < count && trial < count * 100; trial++) {
        const dish = Int8Array.from(available), opponent = new Int8Array(types.length);
        let valid = true;
        for (let card = 0; card < memory.initialOpponentCount; card++) {
          let pick = random() * dish.reduce((a, b) => a + b, 0), chosen = -1;
          for (let i = 0; i < dish.length; i++) if (dish[i] && (pick -= dish[i]) < 0) { chosen = i; break; }
          dish[chosen]--; opponent[chosen]++;
          if (opponent[chosen] === view.copiesPerType) { valid = false; break; }
        }
        if (valid) particles.push({ opponent, dish });
      }
      if (particles.length !== count) throw new Error('Cannot initialize temporal particles');
      model = memory.temporal = { particles, processed: 0, resets: 0, otherMemory: knowledge.createMemory(memory.role === 'human' ? 'wendy' : 'human') };
    }
    const other = memory.role === 'human' ? 'wendy' : 'human';
    for (; model.processed < memory.transitions.length; model.processed++) {
      const batch = memory.transitions[model.processed], survivors = [], weights = [];
      for (const particle of model.particles) {
        let valid = true, weight = 1;
        for (const event of batch) {
          const index = types.indexOf(event.type);
          if (event.kind === 'request' && event.player === other && particle.opponent[index] === 0) { valid = false; break; }
          if (event.kind === 'request' && event.player === other && options.requestBias) {
            const requestWeights = Array.from(particle.opponent, (quantity, i) => {
              if (!quantity) return 0;
              const clue = model.otherMemory.lower[types[i]] > 0 ? 8 : model.otherMemory.upper[types[i]] === 0 ? .3 : 2;
              return clue * (quantity === view.copiesPerType - 1 ? options.requestBias : 1);
            });
            const total = requestWeights.reduce((a, b) => a + b, 0), held = particle.opponent.filter(quantity => quantity > 0).length;
            weight *= .2 / held + .8 * requestWeights[index] / total;
          }
          if (event.kind === 'miss' && event.player === memory.role && particle.opponent[index] > 0) { valid = false; break; }
          if (event.kind === 'transfer' && event.from === other) {
            if (!particle.opponent[index]) { valid = false; break; } particle.opponent[index]--;
          }
          if (event.kind === 'transfer' && event.to === other) particle.opponent[index]++;
          if (event.kind === 'draw' && event.player === memory.role) {
            if (!particle.dish[index]) { valid = false; break; } particle.dish[index]--;
          }
          if (event.kind === 'draw' && event.player === other) {
            const total = particle.dish.reduce((a, b) => a + b, 0);
            if (!total) { valid = false; break; }
            let pick = random() * total;
            for (let i = 0; i < types.length; i++) if (particle.dish[i] && (pick -= particle.dish[i]) < 0) {
              particle.dish[i]--; particle.opponent[i]++; break;
            }
          }
          if (event.kind === 'set' && event.player === other) {
            if (particle.opponent[index] !== view.copiesPerType) { valid = false; break; } particle.opponent[index] = 0;
          }
        }
        if (valid && particle.opponent.every(quantity => quantity < view.copiesPerType)) { survivors.push(particle); weights.push(weight); }
      }
      knowledge.observe(model.otherMemory, batch, view.copiesPerType);
      if (!survivors.length) {
        // Finite sampling can miss rare but possible histories. Fall back explicitly.
        model.particles = fromCurrent(); model.resets++; model.processed = memory.transitions.length; break;
      }
      if (survivors.length === model.particles.length && weights.every(weight => weight === 1)) { model.particles = survivors; continue; }
      const cumulative = []; weights.reduce((total, weight) => { cumulative.push(total + weight); return total + weight; }, 0);
      model.particles = Array.from({ length: count }, () => {
        const pick = random() * cumulative.at(-1);
        let lo = 0, hi = cumulative.length - 1;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (cumulative[mid] < pick) lo = mid + 1; else hi = mid; }
        const source = survivors[lo];
        return { opponent: Int8Array.from(source.opponent), dish: Int8Array.from(source.dish) };
      });
    }
    const own = knowledge.counts(view.myHand), completed = new Set([...view.mySets, ...view.opponentSets]);
    const feasible = model.particles.filter(particle => {
      if (particle.opponent.reduce((a, b) => a + b, 0) !== view.opponentHandCount || particle.dish.reduce((a, b) => a + b, 0) !== view.dishCount) return false;
      return types.every((type, i) => particle.opponent[i] + particle.dish[i] === (completed.has(type) ? 0 : view.copiesPerType - (own[type] || 0)));
    });
    if (!feasible.length) { model.particles = fromCurrent(); model.resets++; } else model.particles = feasible;
    function distribution(type) {
      const index = types.indexOf(type), result = Array(view.copiesPerType + 1).fill(0);
      for (const particle of model.particles) result[particle.opponent[index]]++;
      return result.map(value => value / model.particles.length);
    }
    function sample(rng) {
      const particle = model.particles[Math.floor(rng() * model.particles.length)];
      return { opponent: Object.fromEntries(types.map((type, i) => [type, particle.opponent[i]])), dish: Object.fromEntries(types.map((type, i) => [type, particle.dish[i]])) };
    }
    return { probability: type => 1 - distribution(type)[0], distribution, sample, particles: model.particles.length, resets: model.resets };
  }
  const api = { beliefs }; if (node) module.exports = api; else root.TemporalBeliefs = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
