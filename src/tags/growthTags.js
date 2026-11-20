const SOURCE_TEXT = { granted: false, expansion: null };
const CONTROLLED_CREATURES = /^creatures you control (?:gain\b[^,.]+ and )?get\b/i;
const X_FROM_CONTROLLED_CREATURES = /^where X is the number of creatures you control$/i;

export const GROWTH_TAGS = [
    {
        tag: 'exponential',
        match: {
            context: SOURCE_TEXT,
            any: [
                { kind: 'DoublePowerEffect', repeatsForX: true },
                {
                    kind: 'DoubleCountersEffect',
                    counterKind: '+1/+1',
                    context: {
                        ability: { kind: 'ActivatedAbility', isRepeatable: true },
                        sentence: { kind: 'EffectSentence', previous: null }
                    }
                }
            ]
        }
    },
    {
        tag: 'quadratic',
        match: {
            kind: 'ModifyPTEffect',
            modifier: { power: { sign: '+', magnitude: 'X' } },
            context: {
                ...SOURCE_TEXT,
                sentence: {
                    raw: CONTROLLED_CREATURES,
                    trailingCondition: { text: X_FROM_CONTROLLED_CREATURES }
                }
            }
        }
    }
];
