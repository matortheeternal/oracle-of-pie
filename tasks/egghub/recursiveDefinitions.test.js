import assert from 'node:assert/strict';
import test from 'node:test';
import Oracle from '../../src/Oracle.js';

test('recursive custom reminders terminate during tag and diagnostic evaluation', () => {
    const oracle = new Oracle({ definitions: {
        keywords: [{ name: 'Mistsong', reminder: 'Glimmer.' }],
        actions: [{ name: 'Glimmer', reminder: 'Mistsong\nDraw a card.' }]
    } });
    const parsed = oracle.parseFace({ text: 'Mistsong\nGlimmer.' });
    assert.deepEqual(parsed.unrecognized, []);
    assert(parsed.tagMatches.has('draw'));
});
