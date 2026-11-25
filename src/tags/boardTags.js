import { selfOrIncludingSelf } from './selfInclusion.js';

export const PLUS_COUNTERS = {
    kind: ['PutCountersEffect', 'EntersWithCountersEffect'],
    isPlusCounters: true
};
const OTHER_OBJECTS = { refersToSelf: false, isPlayer: false };
const OTHER_OBJECT_REFERENCES = [
    { isBackReference: false },
    { antecedent: { refersToSelf: false, isPlayer: false } }
];
const MASS_PLAYERS = {
    isPlayer: true, isMass: true, canBeOpponent: true,
    not: { kind: 'EffectSubjectGroup' }
};
const TEAM_PUMP = 'ModifyPTEffect';
const YOUR_TEAM = {
    isMass: true, controlledByYou: true, hasType: 'creature', hasNameRestriction: false,
    not: {
        any: [
            { kind: 'NounPhrase', excludesOwnedByYou: true },
            { kind: 'NounPhrase', hasCombatTraitRestriction: true },
            { kind: 'NounPhrase', modifiers: {
                kind: 'StateModifier', restrictsSubtype: true
            } }
        ]
    }
};

export const BOARD_TAGS = [
    {
        tag: 'gives-pp-counters',
        match: {
            ...PLUS_COUNTERS,
            phrases: { ...OTHER_OBJECTS, any: OTHER_OBJECT_REFERENCES }
        }
    },
    {
        tag: 'gains-pp-counters',
        match: {
            ...PLUS_COUNTERS,
            any: selfOrIncludingSelf('phrases'),
            not: { phrases: { kind: 'NounPhrase', hasAdventureRequirement: true } },
            context: { granted: false }
        }
    },
    {
        tag: 'opponent-loses-life',
        match: {
            kind: 'LoseLifeEffect', subjectIsOpponent: true,
            not: {
                any: [
                    { context: { replacement: { replacesLifeLoss: true } } },
                    {
                        subject: { kind: 'PlayerPhrase', player: 'that player' },
                        context: { delayedTrigger: { event: {
                            kind: 'DealsDamageEvent', recipient: { player: 'a player' }
                        } } }
                    }
                ]
            }
        }
    },
    {
        tag: 'group-slug',
        match: {
            any: [
                {
                    kind: 'DamageEffect',
                    phrases: {
                        ...MASS_PLAYERS,
                        not: { kind: 'PlayerPhrase', player: 'players' }
                    }
                },
                { kind: 'DamageEffect', phrases: { raw: 'each other opponent' } },
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
