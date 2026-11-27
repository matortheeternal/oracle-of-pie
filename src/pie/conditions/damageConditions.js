import PieCondition from './PieCondition.js';

const DAMAGE = ['Damage'];
const PREVENTED_DAMAGE = { events: { kind: 'DamagePreventedEvent' } };
const PREVENTION_TRIGGERS = [
    { ability: PREVENTED_DAMAGE },
    { delayedTrigger: PREVENTED_DAMAGE }
];

export const STAT_SCALED = new PieCondition({
    id: 'creature-stats',
    title: 'Damage scaled by a creature\'s power or toughness',
    match: {
        any: [
            { scalesWithCreatureStats: true },
            { context: { sentence: { definesXByCreatureStats: true } } }
        ]
    },
    groups: DAMAGE
});

export const CREATURE_COUNT_SCALED = new PieCondition({
    id: 'creature-count',
    title: 'Damage scaled by the number of creatures you control',
    match: {
        any: [
            { usesCreatureCount: true },
            { context: { sentence: { definesXByCreatureCount: true } } }
        ]
    },
    groups: DAMAGE
});

export const REDIRECTED = new PieCondition({
    id: 'redirection',
    title: 'Redirected prevented damage',
    match: { context: { any: PREVENTION_TRIGGERS } },
    groups: DAMAGE
});
