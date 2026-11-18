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

export const DRAW_TAGS = [
    {
        tag: 'pure-draw',
        match: { ...YOUR_DRAW, context: { not: DRAW_COSTS } }
    },
    {
        tag: 'burst-draw',
        match: { tag: 'pure-draw', isBurst: true }
    },
    {
        tag: 'cantrip',
        match: { tag: 'pure-draw', isSingleCard: true, context: RESOLVES_OR_ENTERS }
    }
];
