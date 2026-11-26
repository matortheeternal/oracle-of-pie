import assert from 'node:assert/strict';
import test from 'node:test';
import { Oracle } from '../../src/index.js';

const oracle = new Oracle({ repairLineWraps: true });

test('joins incomplete clauses with and without trailing whitespace', () => {
    const text = 'When this creature enters, you gain \n1 life.\n'
        + 'When this creature dies, put\na counter on target permanent.\n'
        + 'Whenever it blocks, \ncreate a Treasure token.';
    assert.equal(oracle.prepareText(text), 'When this creature enters, you gain 1 life.\n'
        + 'When this creature dies, put a counter on target permanent.\n'
        + 'Whenever it blocks, create a Treasure token.');
});

test('preserves ability, chapter, choice, cost, and paragraph boundaries', () => {
    const text = 'Flying \nWhenever this creature attacks, draw a card.\n'
        + 'Choose one — \n• Draw a card.\n• Gain 1 life.\n'
        + 'I — Add {R}.\nII — Add {G}.\n'
        + 'Haste\n[+1]: Draw a card.\n'
        + 'Ward {2}\n{T}: Add {U}.\n'
        + 'A complete line. \n2+ | Draw a card.\n'
        + 'Draw\n\na card.';
    assert.equal(oracle.prepareText(text), text);
});

test('confirms a split phrase and preserves a lowercase independent ability', () => {
    const wrapped = 'When this creature enters, put a +1/+1 counter\non it.';
    const expected = 'When this creature enters, put a +1/+1 counter on it.';
    assert.equal(oracle.prepareText(wrapped), expected);
    const independent = 'Reach\nwhen this creature blocks, draw a card.';
    assert.equal(oracle.prepareText(independent), independent);
});

test('wrap repair is opt-in for text and face parsing', () => {
    const text = 'When this creature enters, you gain \n1 life.';
    const face = { name: 'Wrapped entry', typeLine: 'Creature', text };
    const standard = new Oracle();
    assert.equal(standard.prepareText(text), text);
    assert.equal(standard.parseText(text).isRecognized, false);
    assert.equal(standard.parseFace(face).isFullyRecognized, false);
    assert.equal(oracle.parseText(text).isRecognized, true);
    const parsed = oracle.parseFace(face);
    assert.equal(parsed.isFullyRecognized, true);
    assert.deepEqual(parsed.locate('you gain 1 life'), {
        start: text.indexOf('you gain'),
        end: text.indexOf('.')
    });
});
