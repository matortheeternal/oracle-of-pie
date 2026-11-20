const SOURCE_TEXT = { granted: false, expansion: null };
const PRINTED_KEYWORD = {
    kind: 'Keyword',
    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
};
const DISCOUNT_KEYWORDS = ['affinity', 'convoke', 'delve', 'improvise'];
const SELF_COST_REDUCTION = {
    kind: 'CostModificationEffect',
    modifiesSpellCost: true,
    reducesCost: true,
    subject: { kind: 'SelfReference' },
    context: SOURCE_TEXT
};
const FREE_CAST = { kind: 'PlayCardsEffect', isFree: true, context: SOURCE_TEXT };
const ADDITIONAL_MANA_KEYWORDS = [
    'entwine', 'escalate', 'kicker', 'multikicker', 'offspring', 'replicate', 'squad'
];
const POSITIVE_MANA = /^(?:\{0\})*\{(?:[1-9]\d*|[WUBRGC])\}(?:\{(?:\d+|[WUBRGC])\})*$/;

export const CASTING_MANA_TAGS = [
    {
        tag: 'discount-self',
        match: {
            any: [
                SELF_COST_REDUCTION,
                {
                    ...PRINTED_KEYWORD,
                    name: [...DISCOUNT_KEYWORDS, 'undaunted', 'emerge']
                }
            ]
        }
    },
    {
        tag: 'cost-ignorer',
        match: {
            ...FREE_CAST,
            allowsLands: false,
            subjectIsYou: true,
            not: {
                phrases: {
                    any: [
                        { refersToSelf: true },
                        { kind: 'BackReference', antecedent: null }
                    ]
                }
            }
        }
    },
    {
        tag: 'cheaper-than-mv',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: DISCOUNT_KEYWORDS },
                SELF_COST_REDUCTION,
                { ...FREE_CAST, phrases: { kind: 'SelfReference' } }
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
