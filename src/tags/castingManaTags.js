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
const NONCOLORED_SYMBOL = '\\{(?:\\d+|[CTQ])\\}';
const ONE_ACTIVATION_COLOR = new RegExp(
    `^(?:${NONCOLORED_SYMBOL})*\\{([WUBRG])\\}(?:${NONCOLORED_SYMBOL}|\\{\\1\\})*$`
);
const OPENING_HAND = /^if (?:this card|~) is in your opening hand$/i;
const BEGIN_WITH_SELF = /^begin the game with (?:it|him|her|them) on the battlefield$/i;
const CONTROL_COMMANDER = /^if you control a commander$/i;
const FIRST_SPELL = /^if this spell is the first spell you've cast this game$/i;
const INSTEAD_OF_MANA = /^rather than pay (?:this spell's|its) mana cost$/i;
const COMMANDER_FREE_CAST = {
    ...FREE_CAST,
    phrases: { kind: 'SelfReference' },
    context: {
        ...SOURCE_TEXT,
        sentence: { condition: CONTROL_COMMANDER },
        ability: { hasAdditionalCost: false }
    }
};

export const CASTING_MANA_TAGS = [
    {
        tag: 'offcolor-additional-cost',
        match: {
            ...PRINTED_KEYWORD,
            name: 'kicker',
            parameter: POSITIVE_MANA,
            hasOffcolorManaCost: true
        }
    },
    {
        tag: 'offcolor-ability',
        match: {
            kind: 'ActivatedAbility',
            context: SOURCE_TEXT,
            card: { isSingleFaced: true, isLand: false },
            cost: {
                items: {
                    kind: 'ManaCostItem',
                    symbols: ONE_ACTIVATION_COLOR,
                    hasOffcolorManaCost: true
                },
                not: { items: { not: { kind: 'ManaCostItem' } } }
            }
        }
    },
    {
        tag: 'manaless-value',
        match: {
            any: [
                COMMANDER_FREE_CAST,
                {
                    kind: ['ExileEffect', 'SacrificeEffect'],
                    subjectIsYou: true,
                    isOptional: true,
                    context: {
                        ...SOURCE_TEXT,
                        ability: { kind: 'SpellAbility', hasAdditionalCost: false },
                        sentence: { trailingCondition: { text: INSTEAD_OF_MANA } }
                    }
                }
            ]
        }
    },
    {
        tag: 'potentially-free',
        match: {
            any: [
                {
                    kind: 'BeginGameEffect',
                    subjectIsYou: true,
                    raw: BEGIN_WITH_SELF,
                    context: { ...SOURCE_TEXT, sentence: { condition: OPENING_HAND } }
                },
                COMMANDER_FREE_CAST,
                {
                    ...FREE_CAST,
                    subjectIsYou: true,
                    phrases: { kind: 'BackReference' },
                    context: {
                        ...SOURCE_TEXT,
                        sentence: { condition: FIRST_SPELL },
                        ability: { hasAdditionalCost: false }
                    }
                }
            ]
        }
    },
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
