const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const GRANT_RECIPIENT = {
    refersToSelf: false,
    any: [{ isBackReference: false }, { antecedent: { isTargeted: true } }]
};
const GRANTED = 'grantedKeywordNames';

export const KEYWORD_FAMILY_TAGS = [
    {
        family: 'gives-{keyword}',
        keywords: GRANTED,
        match: {
            kind: GRANTING_EFFECTS,
            subject: GRANT_RECIPIENT,
            context: { expansion: null }
        }
    },
    {
        family: 'gains-{keyword}',
        keywords: GRANTED,
        match: { kind: GRANTING_EFFECTS, subject: { refersToSelf: true } }
    },
    {
        family: '{keyword}-counter',
        keywords: 'keywordCounterNames',
        match: { kind: 'PutCountersEffect' }
    }
];
