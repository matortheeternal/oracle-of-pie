const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const GRANT_RECIPIENT = {
    refersToSelf: false,
    any: [{ isBackReference: false }, { antecedent: { isTargeted: true } }]
};
const TEMPORARY_SENTENCE = {
    any: [
        { condition: { isDuration: true } },
        { sentence: { effects: { duration: { isUntilEndOfTurn: true } } } }
    ]
};
const GRANTED_KEYWORDS = [
    'flying', 'haste', 'trample', 'vigilance', 'lifelink', 'deathtouch', 'first strike',
    'menace', 'hexproof', 'indestructible'
];

function givesKeywordTag(keyword) {
    return {
        tag: `gives-${keyword.replace(' ', '-')}`,
        match: {
            kind: GRANTING_EFFECTS,
            grantsKeyword: keyword,
            subject: GRANT_RECIPIENT,
            context: { expansion: null }
        }
    };
}

export const KEYWORD_GRANT_TAGS = [
    ...GRANTED_KEYWORDS.map(givesKeywordTag),
    {
        tag: 'keyword-anthem',
        match: {
            kind: GRANTING_EFFECTS,
            grantsKeywords: true,
            subject: {
                isMass: true,
                controlledByYou: true,
                hasType: 'creature',
                not: { hasExactType: 'permanent' }
            },
            context: { not: TEMPORARY_SENTENCE }
        }
    }
];
