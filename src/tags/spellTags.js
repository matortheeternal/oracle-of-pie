export const SPELL_TAGS = [
    {
        tag: 'modal',
        match: { kind: 'ChooseModesEffect' }
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
            context: { ability: { event: { kind: 'EntersEvent', isSelf: true } } }
        }
    }
];
