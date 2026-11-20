const SOURCE_TEXT = { granted: false, expansion: null };
const PRINTED_KEYWORD = {
    kind: 'Keyword',
    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
};
const DISCOUNT_KEYWORDS = ['affinity', 'convoke', 'delve', 'improvise'];
const ADDITIONAL_MANA_KEYWORDS = [
    'entwine', 'escalate', 'kicker', 'multikicker', 'offspring', 'replicate', 'squad'
];
const POSITIVE_MANA = /^(?:\{0\})*\{(?:[1-9]\d*|[WUBRGC])\}(?:\{(?:\d+|[WUBRGC])\})*$/;

export const CASTING_MANA_TAGS = [
    {
        tag: 'cheaper-than-mv',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: DISCOUNT_KEYWORDS },
                {
                    kind: 'CostModificationEffect',
                    modifiesSpellCost: true,
                    reducesCost: true,
                    subject: { kind: 'SelfReference' },
                    context: SOURCE_TEXT
                },
                {
                    kind: 'PlayCardsEffect',
                    isFree: true,
                    phrases: { kind: 'SelfReference' },
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'more-expensive-than-mv',
        match: {
            ...PRINTED_KEYWORD,
            name: ADDITIONAL_MANA_KEYWORDS,
            parameter: POSITIVE_MANA
        }
    }
];
