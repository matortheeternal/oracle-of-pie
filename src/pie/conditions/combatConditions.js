import PieCondition from './PieCondition.js';

const UNTAPS = ['extra-untap'];
const EXTRA_COMBAT = { kind: 'AdditionalPhaseEffect', addsCombat: true };
const UNBLOCKABLE_IN_SENTENCE = { kind: 'CantEffect', makesUnblockable: true };

export const EXTRA_ATTACK = new PieCondition({
    id: 'extra-attack',
    title: 'Untapping creatures for an additional combat',
    match: { context: { cardText: { effects: { any: [EXTRA_COMBAT] } } } },
    inspections: UNTAPS
});

export const UNTAPPED_CREATURES = new PieCondition({
    id: 'creatures',
    title: 'Untapping creatures',
    match: { phrases: { hasExactType: 'creature' } },
    inspections: UNTAPS
});

export const WITH_UNBLOCKABLE = new PieCondition({
    id: 'with-unblockable',
    title: 'Power boosts bundled with unblockability',
    match: { context: { sentence: { effects: { any: [UNBLOCKABLE_IN_SENTENCE] } } } },
    groups: ['Creatures & combat']
});
