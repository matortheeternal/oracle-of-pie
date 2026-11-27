import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CardColors, Oracle, PieInspector } from '../../src/index.js';
import CitationReview from './CitationReview.js';
import pieFlagItem from './pieFlagItem.js';

test('Pull is queued when the citation is the only reason Red avoids a flag', () => {
    const inspector = new PieInspector();
    const review = new CitationReview(inspector, []);
    const card = { name: 'Push // Pull' };
    const text = 'Put up to two target creature cards from a single graveyard onto the '
        + 'battlefield under your control. They gain haste until end of turn. '
        + 'Sacrifice them at the beginning of the next end step.';
    const parsed = new Oracle().parseFace({ name: 'Pull', typeLine: 'Sorcery', text });
    const faces = [{ parsed, colors: CardColors.fromManaCost('{4}{B/R}{B/R}') }];
    const ordinary = inspector.inspect(faces);
    assert.equal(ordinary.some(flag => flag.inspection.id === 'reanimate'), false);
    review.add(card, faces, ordinary);
    const flag = review.flags.find(candidate => candidate.inspection === 'reanimate');
    assert.equal(flag.policy, 'hybrid');
    assert.deepEqual(flag.offending, ['R']);
    assert.equal(flag.tiers.R.tier, 'none');
    assert.equal(flag.effectiveTiers.R.tier, 'secondary');
    const row = pieFlagItem({ id: 'pull', card, flags: [flag] });
    assert.equal(row.question, 'Is reanimation a color pie break in Red?');
    assert.equal(row.mechanic.name, 'reanimation');
    assert.match(row.mechanic.definition, /Returns creature cards from a graveyard/);
    assert.match(row.evidence[1].text, /Reanimation is a pie break in Red/);
    const haste = review.flags.find(flag => flag.inspection === 'keyword-haste');
    const profile = { counts: { B: 24, G: 42, R: 404, U: 2 } };
    const hasteRow = pieFlagItem({ id: 'pull', card, flags: [haste], profile });
    assert.match(hasteRow.question, /color pie bend in Black/);
    const lines = hasteRow.evidence[1].text.split('\n');
    assert.match(lines[0], /Haste is a pie bend in Black/);
    const frequency = '5.1% of matching monocolor cards printed since 2016 were Black.';
    assert.equal(hasteRow.evidence[1].frequency, frequency);
    const cited = /Mechanical Color Pie \(2021\) lists haste as secondary in Black/;
    assert.match(lines[1], cited);
    assert.doesNotMatch(hasteRow.evidence[1].text, /Green/);
});
