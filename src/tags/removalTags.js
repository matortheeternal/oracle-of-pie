const MASS_OPPOSING = {
    isMass: true,
    isRelativeGroup: false,
    isPermanentObject: true,
    isPlayer: false,
    controlledByYou: false,
    isCardInZone: false
};
const OPPOSING_CREATURE = { isOpposingObject: true, hasType: 'creature' };
const REMOVING_EFFECTS = ['DestroyEffect', 'ExileEffect', 'ReturnEffect', 'DamageEffect'];
const OPPOSING_FLYERS = { requiresFlying: true, controlledByYou: false };
const OPPOSING_SPELL = { hasType: 'spell', controlledByYou: false };

function removesType(type) {
    return {
        any: [
            {
                removesPermanently: true,
                phrases: { isOpposingObject: true, allowsTypeAlone: type }
            },
            {
                kind: 'SacrificeEffect',
                subjectIsOpponent: true,
                phrases: { allowsTypeAlone: type }
            }
        ]
    };
}

export const REMOVAL_TAGS = [
    {
        tag: 'counterspell',
        match: {
            any: [
                {
                    kind: 'CounterEffect',
                    countersSpell: true,
                    phrases: { controlledByYou: false },
                    context: { not: { ability: { event: { kind: 'TargetedEvent' } } } }
                },
                {
                    kind: 'ExileEffect',
                    phrases: { hasExactType: 'spell', controlledByYou: false }
                },
                { kind: ['ReturnEffect', 'TuckEffect'], phrases: OPPOSING_SPELL }
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
        tag: 'removal-tuck',
        match: {
            kind: ['TuckEffect', 'PutEffect'],
            removesPermanently: true,
            phrases: { isOpposingObject: true, isPermanentObject: true, isTargeted: true }
        }
    },
    {
        tag: 'removal-artifact',
        match: removesType('artifact')
    },
    {
        tag: 'removal-enchantment',
        match: removesType('enchantment')
    },
    {
        tag: 'hate-flying',
        match: {
            any: [
                {
                    kind: REMOVING_EFFECTS,
                    phrases: OPPOSING_FLYERS
                },
                {
                    kind: 'ModifyPTEffect',
                    modifier: { lowersToughness: true },
                    phrases: OPPOSING_FLYERS
                }
            ]
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
                    phrases: {
                        isMass: true,
                        isRelativeGroup: false,
                        hasType: 'creature',
                        controlledByYou: false
                    }
                },
                { removesPermanently: true, phrases: MASS_OPPOSING }
            ]
        }
    }
];
