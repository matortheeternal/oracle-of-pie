const SOURCE_TEXT = { granted: false, expansion: null };

export const RULES_EFFECT_TAGS = [
    {
        tag: 'silence',
        match: {
            kind: 'CantEffect',
            preventsSpellcasting: true,
            actingSubject: { isPlayer: true, canBeOpponent: true },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'strive',
        match: {
            kind: 'CostModificationEffect',
            increasesCostPerExtraTarget: true,
            actingSubject: { refersToSelf: true },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'sneak',
        match: {
            kind: 'KeywordAbility',
            hasKeyword: 'ninjutsu',
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'set-life-total',
        match: { kind: 'SetLifeTotalEffect', context: SOURCE_TEXT }
    }
];
