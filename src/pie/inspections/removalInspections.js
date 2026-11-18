const OPPOSING_CREATURE = {
    isOpposingObject: true,
    isBackReference: false,
    hasExactType: 'creature',
    not: { kind: 'AttachedReference' }
};
const DESTROY_OR_EXILE = ['DestroyEffect', 'ExileEffect'];

export const REMOVAL_INSPECTIONS = [
    {
        id: 'counterspell',
        title: 'Counters spells',
        match: { kind: 'CounterEffect', phrases: { hasExactType: 'spell' } }
    },
    {
        id: 'destroy-creature',
        title: 'Destroys creatures',
        match: {
            kind: 'DestroyEffect',
            phrases: { ...OPPOSING_CREATURE, requiresFlying: false }
        }
    },
    {
        id: 'exile-creature',
        title: 'Exiles creatures',
        match: {
            kind: 'ExileEffect',
            isTemporary: false,
            duration: null,
            phrases: OPPOSING_CREATURE
        }
    },
    {
        id: 'bounce-creature',
        title: 'Returns creatures to hand',
        match: { kind: 'ReturnEffect', isBounce: true, phrases: OPPOSING_CREATURE }
    },
    {
        id: 'edict',
        title: 'Makes opponents sacrifice',
        match: { kind: 'SacrificeEffect', subject: { isOpponent: true } }
    },
    {
        id: 'shrink-creature',
        title: 'Lowers toughness',
        match: {
            any: [
                {
                    kind: 'ModifyPTEffect',
                    modifier: { lowersToughness: true },
                    subject: OPPOSING_CREATURE
                },
                {
                    kind: 'PutCountersEffect',
                    isMinusCounters: true,
                    phrases: OPPOSING_CREATURE
                }
            ]
        }
    },
    {
        id: 'destroy-artifact',
        title: 'Removes artifacts',
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            phrases: { isOpposingObject: true, hasExactType: 'artifact' }
        }
    },
    {
        id: 'destroy-enchantment',
        title: 'Removes enchantments',
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            phrases: { isOpposingObject: true, hasExactType: 'enchantment' }
        }
    }
];
