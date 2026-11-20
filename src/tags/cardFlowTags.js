import { DEFECTOR } from './discardTags.js';

export const CARD_FLOW_TAGS = [
    {
        tag: 'draw',
        match: { kind: 'DrawEffect', drawsCards: true }
    },
    {
        tag: 'discard',
        match: {
            kind: 'DiscardEffect',
            not: { hasOpenDiscardCount: true },
            any: [
                { subjectIsOpponent: true },
                { subjectIsYou: true, context: { ...DEFECTOR, granted: false } }
            ]
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
        match: {
            kind: 'KeywordActionEffect',
            action: 'scry',
            context: { not: { sentence: { replacesScry: true } } }
        }
    },
    {
        tag: 'loot',
        match: {
            kind: 'Sentence',
            effectOrder: [
                { kind: 'DrawEffect', not: { subject: { isOpponent: true } } },
                { kind: 'DiscardEffect', subjectIsOpponent: false }
            ]
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
