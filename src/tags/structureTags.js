const TRIGGERED = 'TriggeredAbility';
const OWN_DEATH_TRIGGER = { kind: TRIGGERED, context: { granted: false } };
const PERMANENT_STATIC_TEXT = {
    card: { isInstantOrSorcery: false },
    ability: { kind: 'SpellAbility' }
};
const RESOLVING_ABILITY = { expansion: null, not: PERMANENT_STATIC_TEXT };
const REFLEXIVE_TRIGGER = {
    kind: 'ReflexiveTriggerSentence',
    previous: { isAdditionalCost: false },
    context: RESOLVING_ABILITY
};

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
        match: { kind: TRIGGERED, events: { kind: 'AttacksEvent' } }
    },
    {
        tag: 'death-trigger',
        match: { ...OWN_DEATH_TRIGGER, events: { kind: 'DiesEvent' } }
    },
    {
        tag: 'death-trigger-self',
        match: { ...OWN_DEATH_TRIGGER, events: { kind: 'DiesEvent', isSelf: true } }
    },
    {
        tag: 'cast-trigger-you',
        match: {
            kind: TRIGGERED,
            events: { kind: 'CastEvent', isYou: true, castsSelf: false, isNext: false }
        }
    },
    {
        tag: 'intervening-if-clause',
        match: { kind: TRIGGERED, hasInterveningIf: true }
    },
    {
        tag: 'reflexive-trigger',
        match: REFLEXIVE_TRIGGER
    },
    {
        tag: 'modal',
        match: { isModal: true }
    },
    {
        tag: 'additional-cost',
        match: { kind: 'ConditionalSentence', isAdditionalCost: true }
    }
];
