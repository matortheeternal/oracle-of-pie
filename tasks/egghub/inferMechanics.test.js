import assert from 'node:assert/strict';
import test from 'node:test';
import { inferMechanics, Oracle } from '../../src/index.js';

const CARDS = [
    { name: 'A', faces: [{ rulesText: 'Crystallize. (Create a Kos token.)' }] },
    { name: 'B', faces: [{ rulesText: 'Crystallize. (Create a Kos token.)' }] },
    { name: 'Kos, Mother of the Nightmare', faces: [{ typeLine: 'Token Enchantment' }] }
];

test('suggests clean drafts and links short token names to the set dictionary', () => {
    const definitions = inferMechanics(CARDS);
    assert.deepEqual(definitions.actions, [{
        name: 'crystallize', reminder: 'Create a Kos token.'
    }]);
    const parsed = new Oracle({ definitions }).parseText('Crystallize.');
    const tokenEffects = [...parsed.walk()].map(([node]) => node)
        .filter(node => node.constructor.name === 'CreateTokenEffect');
    const [kos] = tokenEffects[0].tokenDefinitions;
    assert.equal(kos.name, 'Kos, Mother of the Nightmare');
    assert.equal(kos.typeLine, 'Token Enchantment');
    const debug = inferMechanics(CARDS, { includeEvidence: true });
    assert.deepEqual(debug.actions[0].examples, ['A', 'B']);
});
