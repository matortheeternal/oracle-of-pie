const OWN_DISCARD = {
    kind: 'DiscardEffect',
    any: [{ subjectIsOpponent: false }, { sharesSubject: true }]
};
const DRAW_THEN_DISCARD = { effectOrder: [{ kind: 'DrawEffect' }, OWN_DISCARD] };

export const CARD_FLOW_TAGS = [
    {
        tag: 'draw',
        match: { kind: 'DrawEffect' }
    },
    {
        tag: 'discard',
        match: {
            kind: 'DiscardEffect',
            subjectIsOpponent: true,
            not: { context: { sentence: DRAW_THEN_DISCARD } }
        }
    },
    {
        tag: 'mill-opponent',
        match: { kind: 'MillEffect', subjectIsOpponent: true }
    },
    {
        tag: 'mill-self',
        match: { kind: 'MillEffect', subjectIsYou: true }
    },
    {
        tag: 'mill-each',
        match: { kind: 'MillEffect', subjectIsYou: false, affectsYou: true }
    },
    {
        tag: 'scry',
        match: { kind: 'KeywordActionEffect', action: 'scry' }
    },
    {
        tag: 'loot',
        match: {
            kind: 'Sentence',
            ...DRAW_THEN_DISCARD
        }
    },
    {
        tag: 'rummage',
        match: {
            any: [
                {
                    kind: 'ActivatedAbility',
                    cost: { discardsOtherCards: true },
                    body: { effects: { kind: 'DrawEffect' } }
                },
                {
                    kind: 'Sentence',
                    effectOrder: [
                        {
                            kind: 'DiscardEffect',
                            subjectIsOpponent: false,
                            discardsHand: false
                        },
                        { kind: 'DrawEffect' }
                    ]
                }
            ]
        }
    }
];
