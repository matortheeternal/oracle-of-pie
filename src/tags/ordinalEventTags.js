const SECOND_EVENT = {
    context: { granted: false, expansion: null },
    subjectPhrase: { kind: 'PlayerPhrase', player: ['you', 'a player', 'each player'] },
    unreadSubject: null
};

export const ORDINAL_EVENT_TAGS = [
    {
        tag: 'second-draw-matters',
        match: { kind: 'DrawsEvent', ...SECOND_EVENT, ordinal: 2 }
    },
    {
        tag: 'second-spell-matters',
        match: {
            kind: 'CastEvent',
            ...SECOND_EVENT,
            includesCopy: false,
            objectPhrase: { kind: 'CastSpell', ordinal: 2 }
        }
    }
];
