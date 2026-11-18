import { STATIC_GRANT } from './staticGrant.js';

const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
export const KEYWORD_GRANT_TAGS = [
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
