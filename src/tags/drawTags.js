import { WHEEL_SENTENCE } from './handReset.js';

const YOUR_DRAW = { kind: 'DrawEffect', affectsYou: true };
const PAID_EFFECT = { kind: ['DiscardEffect', 'SacrificeEffect'], affectsYou: true };
const DRAW_COSTS = {
    any: [
        { sentence: { linkedEffects: PAID_EFFECT } },
        { cardText: { hasAdditionalCost: true } },
        { ability: { cost: { any: [{ discards: true }, { sacrificesOther: true }] } } }
    ]
};
const SELF_ENTERS = {
    kind: 'TriggeredAbility',
    event: { kind: 'EntersEvent', isSelf: true }
};
const RESOLVES_OR_ENTERS = {
    delayedTrigger: null,
    any: [
        { card: { isInstantOrSorcery: true }, ability: { kind: 'SpellAbility' } },
        { ability: SELF_ENTERS }
    ]
};

const VARIABLE_DRAW = {
    any: [
        { condition: { any: [{ isForEach: true }, { isIfYouDo: true }] } },
        { sentence: { effects: { kind: 'DrawEffect', isSingleCard: false } } }
    ]
};
const SINGLE_DRAW = { ...RESOLVES_OR_ENTERS, not: VARIABLE_DRAW };

export const DRAW_TAGS = [
    {
        tag: 'pure-draw',
        match: { ...YOUR_DRAW, context: { not: { any: [DRAW_COSTS, WHEEL_SENTENCE] } } }
    },
    {
        tag: 'burst-draw',
        match: {
            any: [
                { tag: 'pure-draw', isBurst: true },
                { kind: 'DrawEffect', isBurst: true, context: WHEEL_SENTENCE }
            ]
        }
    },
    {
        tag: 'cantrip',
        match: { tag: 'pure-draw', isSingleCard: true, context: SINGLE_DRAW }
    }
];
