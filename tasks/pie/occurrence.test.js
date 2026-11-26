import assert from 'node:assert/strict';
import test from 'node:test';
import { CardColors, ColorTiers, Oracle, PieInspector } from '../../src/index.js';
import { PRIMARY } from '../../src/pie/ColorTier.js';

test('an exempt occurrence does not hide a later violation', () => {
    const inspector = new PieInspector({
        inspections: [{
            id: 'damage-occurrence',
            title: 'Damage occurrence',
            match: { kind: 'DamageEffect' },
            tiers: ColorTiers.fromNames({ R: 'primary' }),
            exceptions: [{
                id: 'one-damage',
                match: { fixedAmount: 1 },
                tiers: { U: PRIMARY }
            }]
        }]
    });
    const text = 'This creature deals 1 damage to any target. '
        + 'This creature deals 3 damage to any target. '
        + 'This creature deals 3 damage to any target.';
    const parsed = new Oracle().parseFace({
        name: 'Occurrence test',
        text,
        typeLine: 'Creature — Human'
    });
    const faces = [{ parsed, colors: new CardColors({ colors: ['U'] }) }];

    assert.equal(inspector.judge(inspector.attributions(faces)[0]), null);
    const flags = inspector.inspect(faces);
    assert.equal(flags.length, 1);
    assert.equal(flags[0].severity, 'warning');
    assert.deepEqual(flags[0].offending, ['U']);
    assert.match(flags[0].attribution.evidence, /3 damage/);
});
