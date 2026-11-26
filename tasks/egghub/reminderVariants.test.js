import assert from 'node:assert/strict';
import test from 'node:test';
import Oracle from '../../src/Oracle.js';
import inferMechanics from '../../src/inference/inferMechanics.js';

const FIRST = 'Draw a card.';
const SECOND = 'Create a Treasure token.';

test('discovery groups distinct reminders for one keyword', () => {
    const rulesText = `Mistsong (${FIRST})\n`
        + `Target creature gains Mistsong until end of turn. (${SECOND})`;
    const cards = [{ name: 'Mist Singer', faces: [{ rulesText }] }];
    const { keywords } = inferMechanics(cards, { includeEvidence: true });
    assert.equal(keywords.length, 1);
    assert.deepEqual(keywords[0].reminders, [FIRST, SECOND]);
    assert.equal(keywords[0].reminder, FIRST);
    assert.deepEqual(inferMechanics(cards).keywords[0].reminders, [FIRST, SECOND]);
});

test('keywords prefer printed wording and fall back to the first reminder', () => {
    const oracle = new Oracle({ definitions: {
        keywords: [{ name: 'Mistsong', reminders: [FIRST, SECOND] }]
    } });
    assert(oracle.parseFace({ text: 'Mistsong' }).tagMatches.has('draw'));
    const printed = oracle.parseFace({ text: `Mistsong (${SECOND})` });
    assert(printed.tagMatches.has('ramp'));
    assert(!printed.tagMatches.has('draw'));
});

test('discovery types reminders by where they were printed', () => {
    const rulesText = `Mistsong (${FIRST})\n`
        + `Target creature gains Mistsong until end of turn. (${SECOND})\n`
        + 'Creatures you control have Mistsong. (Their wings sing.)\n'
        + '*Mistsong*: Reference wording.';
    const cards = [{ name: 'Mist Singer', faces: [{ rulesText }] }];
    const [keyword] = inferMechanics(cards).keywords;
    assert.deepEqual(keyword.reminderTypes, {
        [FIRST]: 'static', [SECOND]: 'granted', 'Their wings sing.': 'anthem'
    });
});

test('the most frequent printing decides a shared reminder type', () => {
    const cards = ['A', 'B', 'C'].map((name, index) => ({ name, faces: [{
        rulesText: index ? `Mistsong (${FIRST})`
            : `Target creature gains Mistsong. (${FIRST})`
    }] }));
    const [keyword] = inferMechanics(cards).keywords;
    assert.deepEqual(keyword.reminderTypes, { [FIRST]: 'static' });
});
