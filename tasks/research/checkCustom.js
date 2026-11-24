import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Oracle, PieInspector, CardColors } from '../../src/index.js';
import MtgishAdapter from './MtgishAdapter.js';
import { SPIKE_TAGS } from './mtgishSemantics.js';

const [input] = process.argv.slice(2);
if (!input) throw new Error('Pass the freshly parsed custom.jsonl file');
const adapter = new MtgishAdapter(input);
const oracle = new Oracle();
const inspector = new PieInspector();
const cards = JSON.parse(fs.readFileSync(
    new URL('./custom-cards.json', import.meta.url), 'utf8'
));

function compare(entry) {
    const face = entry.cards[0];
    const colors = CardColors.fromManaCost(face.manaCost);
    const parsed = oracle.parseFace({
        name: face.name, text: face.text, typeLine: face.type
    });
    const prediction = adapter.predict({
        name: face.name,
        faces: [{ name: face.name, colors: colors.colors, mana_cost: face.manaCost }]
    });
    if (!prediction.available)
        return { name: face.name, status: 'unsupported', spikeTags: [] };
    const ours = [...parsed.tags.keys()].sort();
    const theirs = Object.keys(prediction.tags).sort();
    assert.deepEqual(theirs, ours.filter(tag => SPIKE_TAGS.includes(tag)), face.name);
    const originalFlags = inspector.inspect([{ parsed, colors }]);
    const flags = values => values.map(f => `${f.inspection.id ?? f.inspection}`
        + `|${f.severity}|${f.offending.join('')}`).sort();
    assert.deepEqual(flags(prediction.flags), flags(originalFlags), face.name);
    return {
        name: face.name, text: face.text,
        baselineTags: ours, spikeTags: theirs,
        flags: flags(prediction.flags)
    };
}

const results = cards.map(compare);
const opponent = results.find(result => result.name === 'Research Opponent Draw');
assert.equal(opponent.status, 'unsupported');
assert.equal(results.filter(result => result.status !== 'unsupported').length, 5);
const own = results.find(result => result.name === 'Research Red Draw');
assert.equal(own.spikeTags.includes('draw'), true);
console.log(JSON.stringify(results, null, 2));
