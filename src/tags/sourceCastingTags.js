const SOURCE_TEXT = { granted: false, expansion: null };
const PRINTED_KEYWORD = {
    kind: 'Keyword',
    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
};
const SOURCE_EXILE_KEYWORDS = [
    'aftermath', 'beam me up', 'craft', 'disturb', 'embalm', 'encore', 'eternalize',
    'flashback', 'foretell', 'harmonize', 'jump-start', 'madness', 'plot', 'rebound',
    'scavenge', 'suspend', 'unearth', 'warp'
];
const ALTERNATIVE_CAST_KEYWORDS = [
    'awaken', 'beam me up', 'bestow', 'blitz', 'cleave', 'dash', 'disguise',
    'disturb', 'emerge', 'escape', 'evoke', 'flashback', 'foretell', 'freerunning',
    'harmonize', 'impending', 'madness', 'mayhem', 'megamorph', 'miracle',
    'more than meets the eye', 'morph', 'mutate', 'overload', 'plot',
    'prowl', 'rebound', 'sneak', 'spectacle', 'surge', 'suspend', 'warp'
];
const SELF_REFERENCE = { kind: 'SelfReference' };

export const SOURCE_CASTING_TAGS = [
    {
        tag: 'exile-self',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: SOURCE_EXILE_KEYWORDS },
                { kind: 'CardText', card: { hasSubtype: 'Adventure' } },
                {
                    kind: ['ExileCost', 'ExileEffect'],
                    phrases: SELF_REFERENCE,
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'alternative-cost',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: ALTERNATIVE_CAST_KEYWORDS },
                {
                    kind: 'PlayCardsEffect',
                    isFree: true,
                    phrases: SELF_REFERENCE,
                    context: SOURCE_TEXT
                }
            ]
        }
    }
];
