const TEMPORARY_SENTENCE = {
    any: [
        { condition: { isDuration: true } },
        { sentence: { effects: { duration: { isUntilEndOfTurn: true } } } }
    ]
};

export const STATIC_GRANT = {
    not: { any: [TEMPORARY_SENTENCE, { card: { isInstantOrSorcery: true } }] }
};
