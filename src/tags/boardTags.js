const PLUS_COUNTERS = { kind: 'PutCountersEffect', isPlusCounters: true };
const MASS_PLAYERS = { isPlayer: true, isMass: true, canBeOpponent: true };

export const BOARD_TAGS = [
    {
        tag: 'gives-pp-counters',
        match: {
            ...PLUS_COUNTERS,
            phrases: { refersToSelf: false, isBackReference: false, isPlayer: false }
        }
    },
    {
        tag: 'gains-pp-counters',
        match: { ...PLUS_COUNTERS, phrases: { refersToSelf: true } }
    },
    {
        tag: 'opponent-loses-life',
        match: { kind: 'LoseLifeEffect', subjectIsOpponent: true }
    },
    {
        tag: 'group-slug',
        match: {
            any: [
                { kind: 'DamageEffect', phrases: MASS_PLAYERS },
                { kind: 'LoseLifeEffect', subject: MASS_PLAYERS }
            ]
        }
    }
];
