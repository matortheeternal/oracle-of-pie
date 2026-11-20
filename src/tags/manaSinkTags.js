const MINIMUM_MANA = 3;
const BOAST = /^boast$/i;
const RESTRICTED_ACTIVATION = /^activate (?:only|this ability only) (?!as a sorcery$)/i;

const REUSABLE_MANA_COST = {
    isRecognized: true,
    any: [{ hasVariableMana: true }, { manaValueAtLeast: MINIMUM_MANA }],
    not: { items: { not: { kind: 'ManaCostItem', hasOnlyManaSymbols: true } } }
};

const MANA_SINK_ACTIVATION = {
    kind: 'ActivatedAbility',
    isRecognized: true,
    isRepeatable: true,
    limitsUses: false,
    cost: REUSABLE_MANA_COST,
    not: {
        body: { sentences: { kind: 'RestrictionSentence', text: RESTRICTED_ACTIVATION } }
    }
};

export const MANA_SINK_TAGS = [
    {
        tag: 'mana-sink',
        match: {
            kind: ['DrawEffect', 'CreateTokenEffect'],
            affectsYou: true,
            context: {
                granted: false,
                expansion: null,
                delayedTrigger: null,
                condition: null,
                sentence: { trailingCondition: null },
                ability: MANA_SINK_ACTIVATION,
                not: { abilities: { kind: 'AbilityWordAbility', abilityWord: BOAST } }
            }
        }
    }
];
