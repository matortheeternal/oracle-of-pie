const SOURCE_TEXT = { granted: false, expansion: null };
const BOUNDED_OPPOSING_PERMANENTS = {
    kind: 'NounPhrase',
    declaresMultipleTargets: true,
    isOpposingObject: true,
    isPermanentObject: true,
    isCardInZone: false
};

export const MULTI_TARGET_TAGS = [
    {
        tag: 'multiple-targets',
        match: {
            any: [
                {
                    kind: 'NounPhrase',
                    declaresMultipleTargets: true,
                    context: SOURCE_TEXT
                },
                {
                    kind: ['DamageEffect', 'FightEffect'],
                    isComplete: true,
                    subject: { isTargeted: true },
                    phrases: { isTargeted: true },
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'multi-removal',
        match: {
            any: [
                {
                    kind: [
                        'DestroyEffect', 'ExileEffect', 'ReturnEffect', 'TuckEffect',
                        'PutEffect'
                    ],
                    removesPermanently: true,
                    isComplete: true,
                    phrases: BOUNDED_OPPOSING_PERMANENTS,
                    context: SOURCE_TEXT
                },
                {
                    kind: 'DamageEffect',
                    phrases: BOUNDED_OPPOSING_PERMANENTS,
                    context: SOURCE_TEXT
                },
                {
                    kind: 'SacrificeEffect',
                    subject: { player: 'each opponent' },
                    primaryObject: { isPermanentObject: true, isMass: false },
                    context: SOURCE_TEXT
                }
            ]
        }
    }
];
