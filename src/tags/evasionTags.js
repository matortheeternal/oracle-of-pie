import { DEFAULT_KEYWORDS } from '../defaultKeywords.js';

const EVASION_KEYWORD = new RegExp(
    '^(?:flying|menace|shadow|fear|intimidate|skulk|horsemanship|[a-z ]*walk)$', 'i'
);
const EVASION_GRANTS = DEFAULT_KEYWORDS.filter(keyword => EVASION_KEYWORD.test(keyword))
    .map(keyword => ({ grantsKeyword: keyword.toLowerCase() }));
const SOURCE = { granted: false, expansion: null };

const UNBLOCKABLE = {
    kind: 'CantEffect',
    makesUnblockable: true,
    subject: { refersToSelf: true },
    context: SOURCE
};

export const EVASION_TAGS = [
    {
        tag: 'evasion',
        match: {
            any: [
                { kind: 'CantEffect', restriction: 'be blocked', context: SOURCE },
                {
                    kind: 'KeywordAbility',
                    keywords: { keywords: { name: EVASION_KEYWORD } },
                    context: SOURCE
                },
                {
                    kind: ['GrantEffect', 'ModifyPTEffect', 'BecomesEffect'],
                    any: EVASION_GRANTS,
                    context: SOURCE
                }
            ]
        }
    },
    {
        tag: 'unblockable',
        match: UNBLOCKABLE
    }
];
