import assert from 'node:assert/strict';
import test from 'node:test';
import { Oracle } from '../../src/index.js';
import InlineActionHarvest from '../../src/inference/InlineActionHarvest.js';

const CRYSTALLIZE = 'Put a +1/+1 counter on a creature you control or create a Treasure';

test('harvests a repeated inline action and expands reminderless uses', () => {
    const harvest = new InlineActionHarvest(new Oracle());
    harvest.addLine(`When this creature enters, crystallize. (${CRYSTALLIZE}.)`, 'One');
    harvest.addLine(`Crystallize. (${CRYSTALLIZE} token.)`, 'Two');
    const actions = harvest.definitions;
    assert.deepEqual(actions.map(action => action.name), ['crystallize']);
    const oracle = new Oracle({ definitions: { actions } });
    const parsed = oracle.parseText('When this creature enters, crystallize.');
    assert.equal(parsed.isRecognized, true);
    const expanded = [...parsed.walk()].filter(([, context]) => context.expansion);
    assert.ok(expanded.some(([node]) => node.constructor.name === 'PutCountersEffect'));
    assert.ok(expanded.some(([node]) => node.constructor.name === 'CreateTokenEffect'));
});

test('rejects contradictory inline reminders', () => {
    const harvest = new InlineActionHarvest(new Oracle());
    harvest.addLine('Crystallize. (Draw a card.)', 'One');
    harvest.addLine('Crystallize. (Draw a card.)', 'Two');
    harvest.addLine('Crystallize. (Create a Treasure token.)', 'Three');
    assert.deepEqual(harvest.definitions, []);
});

test('ignores card types and activated ability reminders', () => {
    const harvest = new InlineActionHarvest(new Oracle());
    for (const name of ['One', 'Two']) {
        harvest.addLine('Destroy target artifact or enchantment. (Draw a card.)', name);
        harvest.addLine('Reincarnate. ({R}: Draw a card.)', name);
    }
    assert.deepEqual(harvest.definitions, []);
});
