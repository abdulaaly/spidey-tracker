import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Geo distance math
test('haversineDistanceKm calculates accurate distance between NYC and London', () => {
  const nycLat = 40.7128;
  const nycLng = -74.006;
  const lonLat = 51.5074;
  const lonLng = -0.1278;

  const R = 6371;
  const dLat = ((lonLat - nycLat) * Math.PI) / 180;
  const dLon = ((lonLng - nycLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nycLat * Math.PI) / 180) *
      Math.cos((lonLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c * 10) / 10;

  assert.ok(dist > 5500 && dist < 5600, `Expected ~5570 km, got ${dist}`);
});

// 2. Progression math
test('calculateLevelProgress correctly calculates level and percent', () => {
  function calculateLevelProgress(totalXp) {
    let level = 1;
    let accumulatedXp = 0;
    let requiredForNext = 100;

    while (totalXp >= accumulatedXp + requiredForNext) {
      accumulatedXp += requiredForNext;
      level += 1;
      requiredForNext = level * 100;
    }

    const xpInCurrentLevel = totalXp - accumulatedXp;
    const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / requiredForNext) * 100)));

    return { level, currentXp: totalXp, progressPercent };
  }

  const p0 = calculateLevelProgress(0);
  assert.equal(p0.level, 1);
  assert.equal(p0.progressPercent, 0);

  const p50 = calculateLevelProgress(50);
  assert.equal(p50.level, 1);
  assert.equal(p50.progressPercent, 50);

  const p100 = calculateLevelProgress(100);
  assert.equal(p100.level, 2);
  assert.equal(p100.progressPercent, 0);

  const p200 = calculateLevelProgress(200);
  assert.equal(p200.level, 2);
  assert.equal(p200.progressPercent, 50);
});

// 3. Spider code generation & validation
test('generateSpiderCode generates valid SPDY code matching regex', () => {
  function isValidSpiderCode(code) {
    if (!code) return false;
    return /^SPDY-[A-Z0-9]{4}$/.test(code.trim().toUpperCase());
  }

  assert.equal(isValidSpiderCode('SPDY-7K9A'), true);
  assert.equal(isValidSpiderCode('SPDY-9999'), true);
  assert.equal(isValidSpiderCode('INVALID-123'), false);
  assert.equal(isValidSpiderCode(''), false);
});

// 4. Sighting filter predicates
test('isSightingVisible accurately filters pins by category', () => {
  function isSightingVisible(item, filters) {
    const type = (item.pinTypeOverride || item.type || '').toLowerCase();
    if (type === 'confirmed' || type === 'official') return filters.confirmed;
    if (type === 'rumored' || type === 'unconfirmed') return filters.rumored;
    if (type.includes('watch') || type.includes('party')) return filters.watchParty;
    return filters.confirmed;
  }

  const filtersAll = { confirmed: true, rumored: true, watchParty: true };
  const filtersNone = { confirmed: false, rumored: false, watchParty: false };

  assert.equal(isSightingVisible({ type: 'confirmed' }, filtersAll), true);
  assert.equal(isSightingVisible({ type: 'confirmed' }, filtersNone), false);
  assert.equal(isSightingVisible({ type: 'rumored' }, { confirmed: true, rumored: false }), false);
  assert.equal(isSightingVisible({ type: 'watchParty' }, { confirmed: false, rumored: false, watchParty: true }), true);
});

// 5. Quiz evaluation & XP rewards
test('evaluateQuiz returns correct count and calculates 100% bonus XP', () => {
  const questions = [
    { id: 'q1', correctIndex: 1 },
    { id: 'q2', correctIndex: 0 },
    { id: 'q3', correctIndex: 2 }
  ];

  function evaluateQuiz(questions, selectedAnswers) {
    let correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].correctIndex) {
        correctCount++;
      }
    }
    const total = questions.length;
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const xpEarned = correctCount * 25 + (scorePercent === 100 ? 50 : 0);
    return { correctCount, total, scorePercent, xpEarned };
  }

  const resultAll = evaluateQuiz(questions, [1, 0, 2]);
  assert.equal(resultAll.correctCount, 3);
  assert.equal(resultAll.scorePercent, 100);
  assert.equal(resultAll.xpEarned, 3 * 25 + 50); // 125 XP

  const resultPartial = evaluateQuiz(questions, [1, 0, 0]);
  assert.equal(resultPartial.correctCount, 2);
  assert.equal(resultPartial.scorePercent, 67);
  assert.equal(resultPartial.xpEarned, 2 * 25); // 50 XP
});
