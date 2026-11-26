import assert from 'node:assert/strict';
import test from 'node:test';
import Oracle from '../../src/Oracle.js';
import {
    effectiveTags, inheritedTagSources, specificTags
} from '../../src/tags/tagRelationships.js';

const oracle = new Oracle();

test('tags Zarun for regrowth and repeatable recursion', () => {
    const parsed = oracle.parseFace({
        name: 'Zarun, the Shadowed Spire',
        typeLine: 'Legendary Land',
        text: '{T}: Add {B}.\n\n'
            + '{4}{B}{B}, {T}: Return target card from your graveyard to your hand.'
    });
    assert(parsed.tagMatches.has('regrowth'));
    assert(parsed.tagMatches.has('repeatable-recursion'));
});

test('recognizes nonland removal through the pronoun on Vaporize', () => {
    const parsed = oracle.parseFace({
        name: 'Vaporize',
        typeLine: 'Instant',
        text: 'Target nonland permanent loses all abilities until end of turn.'
            + ' Destroy it.'
    });
    assert(parsed.tagMatches.has('removal-nonland'));
});

test('tags evasion keywords, grants and blocking restrictions', () => {
    const evasiveText = [
        'Flying, menace',
        'Target creature gains flying until end of turn.',
        'This creature can\'t be blocked by creatures with power 2 or less.'
    ];
    for (const text of evasiveText)
        assert(oracle.parseFace({ text }).tagMatches.has('evasion'));
    assert(!oracle.parseFace({ text: 'Trample' }).tagMatches.has('evasion'));
});

test('expands parent tags and preserves draw-engine as an alias', () => {
    assert.deepEqual(specificTags(['draw', 'pure-draw', 'draw-engine']), [
        'repeatable-pure-draw'
    ]);
    assert.deepEqual(inheritedTagSources(['repeatable-pure-draw']).get('draw'), [
        'repeatable-pure-draw'
    ]);
    assert(effectiveTags(['repeatable-pure-draw']).includes('draw-engine'));
    assert(effectiveTags(['draw-engine']).includes('draw'));
    assert.deepEqual(specificTags(effectiveTags(['burn-any'])), ['burn-any']);
    assert(effectiveTags(['burn-any']).includes('removal-planeswalker'));
});

test('inherits supported Scryfall removal and counterspell parents', () => {
    const expected = [
        'removal-artifact', 'removal-creature', 'removal-enchantment',
        'removal-planeswalker', 'counterspell'
    ];
    const tags = ['removal-nonland', 'counterspell-soft'];
    const all = effectiveTags(tags);
    for (const parent of expected) assert(all.includes(parent), parent);
    assert.deepEqual(specificTags(all), tags);
});
