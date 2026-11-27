import {
    REDIRECTED_DAMAGE, FLYER_DAMAGE, STAT_SCALED_DAMAGE, CREATURE_COUNT_DAMAGE,
    COMBATANT_DAMAGE, TAPPED_CREATURE_DAMAGE
} from './exceptions.js';

const ANY_TARGET_DAMAGE = 'Deal N damage to creature, planeswalker, and/or player.';
const DIRECT_DAMAGE = { kind: 'DamageEffect', isPowerBased: false };

export const DAMAGE_INSPECTIONS = [
    {
        id: 'damage-creature',
        title: 'Deals direct damage to creatures',
        group: 'Damage',
        cites: ANY_TARGET_DAMAGE,
        citationOmits: ['W'],
        exceptions: [
            REDIRECTED_DAMAGE, FLYER_DAMAGE, STAT_SCALED_DAMAGE, CREATURE_COUNT_DAMAGE,
            COMBATANT_DAMAGE, TAPPED_CREATURE_DAMAGE
        ],
        match: { ...DIRECT_DAMAGE, phrases: { hitsCreature: true } }
    },
    {
        id: 'damage-player',
        title: 'Deals direct damage to players',
        group: 'Damage',
        cites: ANY_TARGET_DAMAGE,
        exceptions: [REDIRECTED_DAMAGE],
        match: { ...DIRECT_DAMAGE, phrases: { hitsPlayer: true } }
    },
    {
        id: 'bite',
        title: 'Creature deals damage equal to its power',
        group: 'Damage',
        cites: '"Bite"',
        match: {
            kind: 'DamageEffect',
            isPowerBased: true,
            phrases: { isAnyTarget: false, hitsCreature: true }
        }
    },
    {
        id: 'fight',
        title: 'Fights',
        group: 'Damage',
        cites: 'Fight',
        match: { kind: 'FightEffect', phrases: { isOpposingObject: true } }
    }
];
