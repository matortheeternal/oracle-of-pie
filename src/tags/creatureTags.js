const NOT_SELF = { refersToSelf: false };
const GRANTS_FLYING = { names: 'flying' };

export const CREATURE_TAGS = [
    {
        tag: 'lifegain',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    },
    {
        tag: 'tapper-creature',
        match: {
            kind: 'TapEffect',
            phrases: { isOpposingObject: true, hasType: 'creature' }
        }
    },
    {
        tag: 'threaten',
        match: {
            kind: 'GainControlEffect',
            duration: { isUntilEndOfTurn: true },
            phrases: { any: [{ hasType: 'creature' }, { hasType: 'permanent' }] }
        }
    },
    {
        tag: 'gives-flying',
        match: {
            any: [
                { kind: 'GrantEffect', grantsKeyword: 'flying', subject: NOT_SELF },
                { kind: 'ModifyPTEffect', keywords: GRANTS_FLYING, subject: NOT_SELF }
            ]
        }
    },
    {
        tag: 'anthem',
        match: {
            kind: 'ModifyPTEffect',
            modifier: { isPowerBoost: true },
            duration: null,
            subject: { isMass: true, controlledByYou: true, hasType: 'creature' }
        }
    },
    {
        tag: 'flicker-creature',
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    }
];
