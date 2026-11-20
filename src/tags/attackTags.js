const ATTACK_TRIGGER = { kind: 'TriggeredAbility' };
const ATTACK_EVENT = { kind: 'AttacksEvent' };
const OWN_ABILITY = { granted: false };
const OTHER_ATTACK_EVENT = {
    ...ATTACK_EVENT,
    unreadSubject: null,
    any: [
        { isYou: true },
        {
            subjectPhrase: {
                kind: 'NounPhrase',
                controlledByYou: true,
                hasType: 'creature'
            }
        },
        { subjectPhrase: { isAttached: true } },
        {
            subjectPhrase: {
                hasExactType: 'creature',
                controlledByOpponent: false,
                refersToSelf: false
            },
            objectPhrase: null,
            unreadText: null
        },
        {
            subjectPhrase: { refersToSelf: false },
            objectPhrase: { isOpponent: true }
        }
    ]
};

export const ATTACK_TAGS = [
    {
        tag: 'attacking-matters-self',
        match: {
            ...ATTACK_TRIGGER,
            context: OWN_ABILITY,
            events: {
                ...ATTACK_EVENT,
                any: [
                    { isSelf: true },
                    { subjectPhrase: { refersToSelf: true }, unreadSubject: null }
                ]
            }
        }
    },
    {
        tag: 'attacking-matters',
        match: {
            any: [
                { ...ATTACK_TRIGGER, events: OTHER_ATTACK_EVENT },
                { kind: 'AbilityWordAbility', abilityWord: 'Raid' },
                { kind: 'NounPhrase', hasQualifier: 'attacking', controlledByYou: true }
            ]
        }
    }
];
