const SPELL_COST_REDUCER = {
    kind: 'CostModificationEffect',
    reducesCost: true,
    modifiesSpellCost: true,
    subject: { controlledByYou: true, refersToSelf: false }
};

export const SPELL_TAGS = [
    {
        tag: 'cost-reducer',
        match: {
            ...SPELL_COST_REDUCER,
            subject: {
                refersToSelf: false,
                any: [{ controlledByYou: true }, { kind: 'NounPhrase' }]
            }
        }
    },
    {
        tag: 'cost-reducer-creature',
        match: {
            ...SPELL_COST_REDUCER,
            subject: {
                ...SPELL_COST_REDUCER.subject,
                any: [
                    { hasExactType: 'creature' },
                    { hasExactType: 'spell', namesCreatureSubtype: true }
                ]
            }
        }
    },
    {
        tag: 'copy-spell',
        match: {
            kind: 'CopyEffect',
            copiesNonpermanentSpell: true,
            context: { granted: false },
            not: { phrases: { kind: 'SelfReference' } }
        }
    },
    {
        tag: 'fog',
        match: {
            kind: 'PreventDamageEffect',
            isAll: true,
            isCombatOnly: true,
            isUnrestricted: true
        }
    },
    {
        tag: 'auto-equip',
        match: {
            kind: 'AttachEffect',
            card: { isEquipment: true },
            recipientPhrases: { kind: 'NounPhrase' },
            context: { ability: { events: { kind: 'EntersEvent', isSelf: true } } }
        }
    }
];
