const SOURCE_TEXT = { granted: false, expansion: null };
const SOURCE_DEATH = {
    ...SOURCE_TEXT,
    delayedTrigger: null,
    ability: {
        kind: 'TriggeredAbility',
        event: { kind: 'DiesEvent', isSelf: true, unreadSubject: null, unreadText: null }
    }
};

function printedKeyword(names) {
    return {
        kind: 'Keyword',
        name: names,
        context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
    };
}

export const FORM_TAGS = [
    {
        tag: 'copy-self',
        match: {
            any: [
                printedKeyword([
                    'myriad', 'offspring', 'embalm', 'eternalize', 'squad',
                    'replicate', 'storm'
                ]),
                {
                    kind: 'CreateTokenEffect',
                    copiesExplicitSource: true,
                    context: SOURCE_TEXT
                },
                { kind: 'CreateTokenEffect', copiesIt: true, context: SOURCE_DEATH },
                {
                    kind: 'CopyEffect',
                    subjectIsYou: true,
                    phrases: { refersToSelf: true },
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'copy-instant',
        match: {
            kind: 'CopyEffect',
            copiesInstantOrSorcery: true,
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'shapechange',
        match: {
            any: [
                {
                    kind: 'SetBasePTEffect',
                    actingSubject: {
                        any: [
                            { refersToSelf: true },
                            { hasType: 'creature', controlledByYou: true }
                        ]
                    },
                    context: SOURCE_TEXT
                },
                {
                    kind: 'BecomesEffect',
                    setsPowerToughness: true,
                    isCopy: false,
                    any: [
                        {
                            actingSubject: {
                                hasType: 'creature',
                                isCardInZone: false,
                                isBackReference: false,
                                refersToSelf: false
                            }
                        },
                        {
                            actingSubject: { refersToSelf: true },
                            card: { isCreature: true }
                        }
                    ],
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'color-change',
        match: { kind: 'BecomesEffect', setsColor: true, context: SOURCE_TEXT }
    }
];
