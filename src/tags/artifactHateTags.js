const SOURCE_TEXT = { granted: false, expansion: null };
const OPPOSING_ARTIFACT = { hasExactType: 'artifact', controlledByOpponent: true };

export const ARTIFACT_HATE_TAGS = [
    {
        tag: 'hate-artifact',
        match: {
            context: SOURCE_TEXT,
            any: [
                {
                    kind: 'CantEffect',
                    preventsNextUntap: true,
                    actingSubject: OPPOSING_ARTIFACT
                },
                {
                    kind: 'ActivationBanEffect',
                    sourceTypes: 'artifact'
                },
                {
                    kind: 'EntersTappedEffect',
                    actingSubject: OPPOSING_ARTIFACT
                },
                {
                    kind: [
                        'AddManaEffect', 'CostModificationEffect', 'DefinePTEffect',
                        'ModifyPTEffect'
                    ],
                    usesOpposingArtifactCount: true
                }
            ]
        }
    }
];
