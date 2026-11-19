const ADDITIONAL_COST_KEYWORDS = [
    'kicker', 'multikicker', 'casualty', 'bargain', 'spree', 'offspring', 'replicate',
    'jump-start', 'retrace', 'entwine', 'buyback', 'gift', 'escalate', 'tiered', 'squad',
    'conspire'
];
const ADDITIONAL_COST_KEYWORD = {
    kind: 'KeywordAbility',
    keywords: { keywords: { name: ADDITIONAL_COST_KEYWORDS } },
    context: { granted: false }
};
const TRIGGERED = 'TriggeredAbility';
const OWN_DEATH_TRIGGER = { kind: TRIGGERED, context: { granted: false } };

export const STRUCTURE_TAGS = [
    {
        tag: 'triggered-ability',
        match: { kind: TRIGGERED }
    },
    {
        tag: 'activated-ability',
        match: { kind: 'ActivatedAbility', context: { granted: false } }
    },
    {
        tag: 'attack-trigger',
        match: { kind: TRIGGERED, event: { kind: 'AttacksEvent' } }
    },
    {
        tag: 'death-trigger',
        match: { ...OWN_DEATH_TRIGGER, event: { kind: 'DiesEvent' } }
    },
    {
        tag: 'death-trigger-self',
        match: { ...OWN_DEATH_TRIGGER, event: { kind: 'DiesEvent', isSelf: true } }
    },
    {
        tag: 'cast-trigger-you',
        match: {
            kind: TRIGGERED,
            event: { kind: 'CastEvent', isYou: true, castsSelf: false }
        }
    },
    {
        tag: 'intervening-if-clause',
        match: { kind: TRIGGERED, hasInterveningIf: true, context: { granted: false } }
    },
    {
        tag: 'modal',
        match: { isModal: true }
    },
    {
        tag: 'additional-cost',
        match: {
            any: [
                { kind: 'ConditionalStatement', isAdditionalCost: true },
                ADDITIONAL_COST_KEYWORD
            ]
        }
    }
];
