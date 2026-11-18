const PLUS_COUNTERS = {
    kind: ['PutCountersEffect', 'EntersWithCountersEffect'],
    isPlusCounters: true
};
const CREATURES_INCLUDING_SELF = {
    hasType: 'creature',
    excludesSelf: false,
    controlledByOpponent: false,
    isBackReference: false,
    hasSubtypes: false,
    not: { hasExactType: 'token' }
};
const SOURCE_GONE = [
    { ability: { event: { kind: 'DiesEvent' } } },
    { ability: { cost: { removesSource: true } } }
];
const SOURCE_ON_BATTLEFIELD = { expansion: null, not: { any: SOURCE_GONE } };
const MASS_PLAYERS = { isPlayer: true, isMass: true, canBeOpponent: true };
const TEAM_PUMP = 'ModifyPTEffect';
const YOUR_TEAM = { isMass: true, controlledByYou: true, hasType: 'creature' };

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
        match: {
            ...PLUS_COUNTERS,
            any: [
                { phrases: { refersToSelf: true } },
                {
                    card: { isCreature: true },
                    context: SOURCE_ON_BATTLEFIELD,
                    phrases: CREATURES_INCLUDING_SELF
                }
            ]
        }
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
    },
    {
        tag: 'power-boost-to-all',
        match: { kind: TEAM_PUMP, modifier: { isPowerBoost: true }, subject: YOUR_TEAM }
    },
    {
        tag: 'toughness-boost-to-all',
        match: {
            kind: TEAM_PUMP,
            modifier: { raisesToughness: true },
            subject: YOUR_TEAM
        }
    }
];
