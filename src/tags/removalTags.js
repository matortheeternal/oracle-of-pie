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
const OPPOSING_FLYERS = { requiresKeyword: 'flying', controlledByYou: false };
const OPPOSING_SPELL = { hasType: 'spell', controlledByYou: false };
const OPPOSING_COUNTER = {
    kind: 'CounterEffect',
    countersSpell: true,
    phrases: { controlledByYou: false }
};
const DAMAGE_CLEANUP = {
    delayedTrigger: { event: { kind: 'IsDealtDamageEvent' } },
    condition: { isDuration: true }
};
const NON_WARD_COUNTER = { not: { ability: { events: { kind: 'TargetedEvent' } } } };
const COUNTERED_THIS_WAY = /^if that spell is countered this way$/i;
const SPELL_ONLY = {
    any: [
        { kind: 'BackReference', objectType: 'spell' },
        {
            hasType: 'spell',
            not: { any: [{ hasType: 'permanent' }, { hasType: 'creature' }] }
        }
    ]
};

function removesType(type) {
    return {
        any: [
            {
                removesPermanently: true,
                not: {
                    context: {
                        any: [
                            { sentence: { condition: COUNTERED_THIS_WAY } },
                            { replacement: { isDamageCleanup: true } }
                        ]
                    }
                },
                phrases: {
                    isOpposingObject: true,
                    allowsTypeAlone: type,
                    not: SPELL_ONLY
                }
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
                    ...OPPOSING_COUNTER,
                    context: NON_WARD_COUNTER
                },
                {
                    kind: 'ExileEffect',
                    phrases: { hasExactType: 'spell', controlledByYou: false }
                },
                {
                    kind: ['ReturnEffect', 'TuckEffect'], isComplete: true,
                    phrases: OPPOSING_SPELL
                }
            ]
        }
    },
    {
        tag: 'counterspell-soft',
        match: {
            ...OPPOSING_COUNTER,
            offersPayment: true,
            context: { ...NON_WARD_COUNTER, expansion: null }
        }
    },
    {
        tag: 'removal-destroy',
        match: {
            kind: 'DestroyEffect', phrases: { isOpposingObject: true },
            context: { not: DAMAGE_CLEANUP }
        }
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
            phrases: {
                isOpposingObject: true,
                isBackReference: false,
                not: {
                    any: [SPELL_ONLY, {
                        kind: 'NounPhrase', modifiers: {
                            kind: 'StateModifier', relatesToSourceCombatRole: true
                        }
                    }]
                }
            }
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
        match: {
            kind: 'SacrificeEffect',
            subjectIsOpponent: true,
            not: {
                any: [
                    { isOptional: true, subject: { player: 'any opponent' } },
                    { context: { granted: true }, subject: { isObjectController: true } },
                    { sharesSubject: true, affectsYou: true }
                ]
            }
        }
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
