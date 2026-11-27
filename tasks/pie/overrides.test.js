import assert from 'node:assert/strict';
import test from 'node:test';
import { CardColors, Oracle, PieInspection, PieInspector } from '../../src/index.js';
import { PIE_CONDITIONS } from '../../src/pie/conditions/index.js';

function face(text, colors, typeLine = 'Instant') {
    const parsed = new Oracle().parseFace({ name: 'Override test', text, typeLine });
    return [{ parsed, colors: new CardColors({ colors }) }];
}

function severities(overrides, faces) {
    const inspector = new PieInspector({ overrides });
    return inspector.inspect(faces)
        .filter(flag => flag.attribution.inspection.id === 'destroy-creature')
        .map(flag => flag.severity);
}

const BLUE_FLYER_REMOVAL = face('Destroy target creature with flying.', ['U']);

test('every default exception uses a condition that applies to its inspection', () => {
    for (const inspection of PieInspector.createInspections({})) {
        for (const exception of inspection.exceptions)
            assert.ok(exception.condition.appliesTo(inspection), exception.id);
    }
});

test('tier overrides replace the default tier for that color', () => {
    assert.deepEqual(severities({}, BLUE_FLYER_REMOVAL), ['warning']);
    const overrides = { 'destroy-creature': { tiers: { U: 'primary' } } };
    assert.deepEqual(severities(overrides, BLUE_FLYER_REMOVAL), []);
});

test('exception overrides replace the default exception list', () => {
    const exceptions = [{ condition: 'flying', colors: ['U'] }];
    const overrides = { 'destroy-creature': { exceptions } };
    assert.deepEqual(severities(overrides, BLUE_FLYER_REMOVAL), []);
});

test('disabled overrides drop the inspection', () => {
    const inspections = PieInspector.createInspections({
        overrides: { 'destroy-creature': { disabled: true } }
    });
    assert.ok(!inspections.some(inspection => inspection.id === 'destroy-creature'));
});

test('subtype exceptions take their creature type from the override', () => {
    const exceptions = [{ condition: 'creature-type', subtype: 'Dragon', colors: ['U'] }];
    const overrides = { 'destroy-creature': { exceptions } };
    const dragonRemoval = face('Destroy target Dragon creature.', ['U']);
    assert.deepEqual(severities({}, dragonRemoval), ['warning']);
    assert.deepEqual(severities(overrides, dragonRemoval), []);
});

test('unknown conditions are skipped without dropping the others', t => {
    t.mock.method(console, 'warn', () => {});
    const exceptions = [
        { condition: 'removed-condition', colors: ['U'] },
        { condition: 'flying', colors: ['U'] }
    ];
    const inspection = new PieInspection({
        id: 'unknown-condition', title: 'Unknown condition', match: {}, exceptions
    });
    assert.deepEqual(inspection.exceptions.map(exception => exception.id), ['flying']);
});

test('conditions have unique ids', () => {
    const ids = PIE_CONDITIONS.map(condition => condition.id);
    assert.equal(new Set(ids).size, ids.length);
});
