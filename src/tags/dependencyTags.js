const SOURCE_TEXT = { granted: false, expansion: null };
const LOWER_BOUND = /^(?:[4-9]|\d{2,}) or (?:more|greater)$/i;
const UPPER_BOUND = /^[0-4] or less$/i;
const MANA_VALUE = { kind: 'WithModifier', property: 'mana value', negated: false };
const COLOR_SPEND = new RegExp(
    String.raw`(?:\{[WUBRGC]\})+ (?:was |wasn't )?spent to cast|`
    + String.raw`\b(?:colors? of mana (?:was |were )?spent|`
    + 'mana of the same color was spent|'
    + '(?:white|blue|black|red|green) mana was spent) to (?:cast|activate)',
    'i'
);

export const DEPENDENCY_TAGS = [
    {
        tag: 'power-doubler',
        match: { kind: 'DoublePowerEffect', context: SOURCE_TEXT }
    },
    {
        tag: 'scales-with-mana-value',
        match: {
            kind: ['DamageEffect', 'DrawEffect', 'DefinePTEffect', 'LifeEffect'],
            usesManaValue: true,
            isComplete: true,
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'creature-count-matters',
        match: {
            kind: [
                'AddManaEffect', 'CostModificationEffect', 'DamageEffect',
                'DefinePTEffect', 'DrawEffect', 'LifeEffect', 'ModifyPTEffect'
            ],
            usesCreatureCount: true,
            isComplete: true,
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'color-spent-matters',
        match: {
            context: SOURCE_TEXT,
            any: [
                { kind: 'ConditionalSentence', condition: COLOR_SPEND },
                { kind: 'TrailingCondition', text: COLOR_SPEND },
                { kind: 'AbilityWordAbility', abilityWord: 'Converge' },
                { kind: 'KeywordAbility', hasKeyword: 'sunburst' }
            ]
        }
    },
    {
        tag: 'high-mana-value-matters',
        match: {
            kind: 'CastEvent',
            isYou: true,
            objectPhrase: { modifiers: { ...MANA_VALUE, comparison: LOWER_BOUND } },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'low-mana-value-matters',
        match: {
            kind: 'ReturnEffect',
            fromGraveyard: true,
            returnsToBattlefield: true,
            primaryObject: { modifiers: { ...MANA_VALUE, comparison: UPPER_BOUND } },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'mana-value-matters',
        match: {
            tag: [
                'high-mana-value-matters',
                'low-mana-value-matters',
                'scales-with-mana-value'
            ]
        }
    },
    {
        tag: 'power-matters-self',
        match: {
            kind: 'DamageEffect',
            usesSourcePower: true,
            context: SOURCE_TEXT
        }
    }
];
