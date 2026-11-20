const OWN_ENTRY = {
    kind: 'TriggeredAbility',
    events: {
        kind: 'EntersEvent',
        any: [{ isSelf: true }, { subjectPhrase: { kind: 'SelfOrAnother' } }]
    }
};
const SOURCE_TEXT = { granted: false, expansion: null };
const ENTRY_EFFECT = {
    ...SOURCE_TEXT,
    delayedTrigger: null,
    abilities: {
        any: [OWN_ENTRY, { kind: 'ChapterAbility', chapters: 'I' }]
    }
};

export const ENTRY_TAGS = [
    {
        tag: 'enters-in-company',
        match: {
            card: { isCreature: true },
            any: [
                {
                    kind: 'CreateTokenEffect',
                    createsCreature: true,
                    subjectIsYou: true,
                    context: ENTRY_EFFECT
                },
                {
                    kind: 'KeywordActionEffect',
                    action: [
                        'amass', 'earthbend', 'endure',
                        'manifest', 'manifest dread', 'recruit'
                    ],
                    any: [{ subjectIsYou: true }, { subject: { refersToSelf: true } }],
                    context: ENTRY_EFFECT
                },
                {
                    kind: 'Keyword',
                    name: ['fabricate', 'offspring', 'squad'],
                    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
                }
            ]
        }
    }
];
