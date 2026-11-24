const SOURCE_TEXT = { granted: false, expansion: null };
const OPPOSING_CREATURE = { hasType: 'creature', isOpposingObject: true };
const SINGLE_TARGET = { isTargeted: true, isMass: false, count: 1, pluralTypes: false };
const POWER_ONLY_SHRINK = {
    kind: 'ModifyPTEffect',
    modifier: { isPowerOnlyShrink: true },
    context: SOURCE_TEXT
};

export const CREATURE_STAT_TAGS = [
    {
        tag: 'shrink',
        match: {
            ...POWER_ONLY_SHRINK,
            subject: {
                ...OPPOSING_CREATURE,
                isMass: false,
                any: [
                    SINGLE_TARGET,
                    { isEnchanted: true },
                    { isBackReference: true, resolved: SINGLE_TARGET }
                ]
            }
        }
    },
    {
        tag: 'mass-shrink',
        match: {
            ...POWER_ONLY_SHRINK,
            subject: { ...OPPOSING_CREATURE, isMass: true, controlledByOpponent: true }
        }
    },
    {
        tag: 'humble',
        match: {
            kind: 'SetBasePTEffect',
            powerToughness: ['0/1', '0/2', '1/1', '1/2'],
            subject: OPPOSING_CREATURE,
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'enlarge',
        match: {
            kind: 'ModifyPTEffect',
            modifier: { isLargeBoost: true },
            subject: {
                ...SINGLE_TARGET,
                hasType: 'creature',
                controlledByOpponent: false
            },
            duration: { isUntilEndOfTurn: true },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'overrun',
        match: {
            kind: 'ModifyPTEffect',
            modifier: { isPowerBoost: true },
            subject: {
                isMass: true,
                controlledByYou: true,
                hasType: 'creature',
                not: { modifiers: { property: 'power' } }
            },
            conferredKeywordNames: 'trample',
            duration: { isUntilEndOfTurn: true },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'scales-with-power',
        match: {
            kind: 'DamageEffect',
            isPowerBased: true,
            actingSubject: { controlledByYou: true },
            context: SOURCE_TEXT
        }
    }
];
