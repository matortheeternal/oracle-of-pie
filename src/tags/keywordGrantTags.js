import { STATIC_GRANT } from './staticGrant.js';

const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const GRANT_RECIPIENT = {
    refersToSelf: false,
    any: [{ isBackReference: false }, { antecedent: { isTargeted: true } }]
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
            duration: null,
            subject: {
                isMass: true,
                isCommanderGroup: false,
                controlledByYou: true,
                hasType: 'creature',
                not: { any: [{ hasExactType: 'permanent' }, { hasExactType: 'spell' }] }
            },
            context: STATIC_GRANT
        }
    }
];
