const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const GRANT_RECIPIENT = {
    refersToSelf: false,
    any: [{ isBackReference: false }, { antecedent: { isTargeted: true } }]
};
const GRANTED = 'grantedKeywordNames';
const COUNTER_EFFECTS = ['PutCountersEffect', 'EntersWithCountersEffect'];
const ONTO_SELF = [
    { kind: GRANTING_EFFECTS, subject: { refersToSelf: true } },
    { kind: COUNTER_EFFECTS, card: { isCreature: true }, phrases: { refersToSelf: true } }
];

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
        keywords: 'conferredKeywordNames',
        match: { any: ONTO_SELF }
    },
    {
        family: '{keyword}-counter',
        keywords: 'keywordCounterNames',
        match: { kind: 'PutCountersEffect' }
    }
];
