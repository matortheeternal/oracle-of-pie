const SPELL_COST_REDUCER = {
    kind: 'CostModificationEffect',
    reducesCost: true,
    modifiesSpellCost: true,
    subject: { controlledByYou: true, refersToSelf: false }
};

export const SPELL_TAGS = [
    {
        tag: 'cost-reducer',
        match: SPELL_COST_REDUCER
    },
    {
        tag: 'cost-reducer-creature',
        match: {
            ...SPELL_COST_REDUCER,
            subject: { ...SPELL_COST_REDUCER.subject, hasExactType: 'creature' }
        }
    },
    {
        tag: 'copy-spell',
        match: {
            kind: 'CopyEffect',
            copiesNonpermanentSpell: true,
            not: { phrases: { kind: 'SelfReference' } }
        }
    },
    {
        tag: 'counter-doubler',
        match: {
            kind: 'DoubleCountersEffect',
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
