const OWN_DISCARD = {
    kind: 'DiscardEffect',
    any: [{ subjectIsOpponent: false }, { sharesSubject: true }]
};
const DRAW_THEN_DISCARD = { effectOrder: [{ kind: 'DrawEffect' }, OWN_DISCARD] };
import { DEFECTOR } from './discardTags.js';

export const CARD_FLOW_TAGS = [
    {
        tag: 'draw',
        match: { kind: 'DrawEffect', drawsCards: true,
            not: { context: { delayedTrigger: { event: { isYou: true } } },
                subject: { kind: 'PlayerPhrase', isObjectOwner: true } } }
    },
    {
        tag: 'discard',
        match: {
            kind: 'DiscardEffect',
            not: {
                any: [
                    { hasOpenDiscardCount: true },
                    { context: { sentence: DRAW_THEN_DISCARD } }
                ]
            },
            any: [
                { subjectIsOpponent: true },
                { subjectIsYou: true, context: { ...DEFECTOR, granted: false } }
            ]
        }
    },
    {
        tag: 'mill-opponent',
        match: {
            kind: 'MillEffect',
            subjectIsOpponent: true,
            context: { not: { replacement: { replacesMill: true } } }
        }
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
        tag: 'surveil',
        match: { kind: 'KeywordActionEffect', action: 'surveil' }
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
                    body: { sentences: { nested: null, effects: { kind: 'DrawEffect' } } }
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
