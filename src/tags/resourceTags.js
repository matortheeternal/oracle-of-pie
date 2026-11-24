import { REPEATABLE_ABILITY, REPEATABLE_SOURCE } from './derivedTags.js';

const OWN_ABILITY = { granted: false, expansion: null };
const TOP_OF_YOUR_LIBRARY = { kind: 'LookAtTopEffect', looksInYourLibrary: true };
const NEXT_TURN_WINDOW
    = /^(?:during|until(?: the end of)?) your next (?:turn|end step)$/i;
const SELF_LIBRARY_EXILE = {
    sentence: {
        previous: {
            effects: { ...TOP_OF_YOUR_LIBRARY, verb: 'exile', subjectIsYou: true }
        }
    }
};

export const RESOURCE_TAGS = [
    {
        tag: 'impulsive-draw',
        match: {
            kind: 'PlayCardsEffect',
            subjectIsYou: true,
            phrases: { kind: 'BackReference', objectType: 'card' },
            context: {
                ...OWN_ABILITY,
                sentence: {
                    previous: {
                        effects: { ...TOP_OF_YOUR_LIBRARY, verb: 'exile' }
                    }
                }
            },
            any: [
                { duration: { isTemporary: true } },
                { context: { condition: { isDuration: true } } }
            ]
        }
    },
    {
        tag: 'repeatable-impulsive-draw',
        match: {
            tag: 'impulsive-draw',
            context: { ...REPEATABLE_SOURCE, ...SELF_LIBRARY_EXILE },
            not: {
                card: { isSingleFaced: false },
                context: { ability: { kind: 'ActivatedAbility' } }
            }
        }
    },
    {
        tag: 'long-term-impulsive-draw',
        match: {
            tag: 'impulsive-draw',
            context: SELF_LIBRARY_EXILE,
            any: [
                { duration: { text: NEXT_TURN_WINDOW } },
                { context: { condition: { condition: NEXT_TURN_WINDOW } } }
            ]
        }
    },
    {
        tag: 'repeatable-impulse',
        match: {
            kind: 'PutEffect',
            destination: 'into your hand',
            context: {
                ...REPEATABLE_SOURCE,
                sentence: {
                    previous: {
                        effects: {
                            ...TOP_OF_YOUR_LIBRARY, verb: 'look', looksAtOneCard: false
                        }
                    }
                }
            }
        }
    },
    {
        tag: 'repeatable-plunder',
        match: {
            tag: 'draw',
            subjectIsYou: true,
            context: {
                ...REPEATABLE_SOURCE,
                ability: {
                    ...REPEATABLE_ABILITY,
                    kind: 'ActivatedAbility',
                    cost: { sacrificesOther: true }
                }
            }
        }
    },
    {
        tag: 'plunder',
        match: {
            tag: 'draw',
            affectsYou: true,
            context: {
                ...OWN_ABILITY,
                ability: { cost: { sacrificesOther: true } }
            }
        }
    }
];
