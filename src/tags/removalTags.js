const MASS_OPPOSING = {
    isMass: true,
    isPlayer: false,
    controlledByYou: false,
    isCardInZone: false
};
const OPPOSING_CREATURE = { isOpposingObject: true, hasType: 'creature' };

export const REMOVAL_TAGS = [
    {
        tag: 'counterspell',
        match: {
            any: [
                {
                    kind: 'CounterEffect',
                    countersSpell: true,
                    context: { not: { ability: { event: { kind: 'TargetedEvent' } } } }
                },
                {
                    kind: 'ExileEffect',
                    phrases: { hasExactType: 'spell', controlledByYou: false }
                }
            ]
        }
    },
    {
        tag: 'removal-destroy',
        match: { kind: 'DestroyEffect', phrases: { isOpposingObject: true } }
    },
    {
        tag: 'removal-exile',
        match: {
            kind: 'ExileEffect',
            isTemporary: false,
            phrases: {
                isOpposingObject: true,
                isBackReference: false,
                isPermanentObject: true
            }
        }
    },
    {
        tag: 'removal-bounce',
        match: {
            kind: 'ReturnEffect',
            isBounce: true,
            phrases: { isOpposingObject: true, isBackReference: false }
        }
    },
    {
        tag: 'removal-artifact',
        match: {
            removesPermanently: true,
            phrases: { isOpposingObject: true, hasType: 'artifact' }
        }
    },
    {
        tag: 'removal-enchantment',
        match: {
            removesPermanently: true,
            phrases: { isOpposingObject: true, hasType: 'enchantment' }
        }
    },
    {
        tag: 'hate-flying',
        match: {
            kind: [
                'DestroyEffect', 'ExileEffect', 'ReturnEffect', 'DamageEffect',
                'ModifyPTEffect'
            ],
            phrases: { requiresFlying: true, controlledByYou: false }
        }
    },
    {
        tag: 'removal-sacrifice',
        match: { kind: 'SacrificeEffect', subjectIsOpponent: true }
    },
    {
        tag: 'removal-toughness',
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
        tag: 'sweeper',
        match: {
            any: [
                {
                    kind: 'ModifyPTEffect',
                    modifier: { lowersToughness: true },
                    subject: MASS_OPPOSING
                },
                {
                    kind: 'SacrificeEffect',
                    subject: { player: 'each player' },
                    primaryObject: MASS_OPPOSING
                },
                {
                    kind: 'DamageEffect',
                    phrases: { isMass: true, hasType: 'creature', controlledByYou: false }
                },
                { removesPermanently: true, phrases: MASS_OPPOSING }
            ]
        }
    }
];
