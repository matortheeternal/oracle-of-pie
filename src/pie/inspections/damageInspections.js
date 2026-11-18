import {
    REDIRECTED_DAMAGE, FLYER_DAMAGE, STAT_SCALED_DAMAGE, COMBATANT_DAMAGE
} from './exceptions.js';

const DIRECT_DAMAGE = { kind: 'DamageEffect', isPowerBased: false };

export const DAMAGE_INSPECTIONS = [
    {
        id: 'damage-creature',
        title: 'Deals direct damage to creatures',
        group: 'Damage',
        exceptions: [
            REDIRECTED_DAMAGE, FLYER_DAMAGE, STAT_SCALED_DAMAGE, COMBATANT_DAMAGE
        ],
        match: { ...DIRECT_DAMAGE, phrases: { hitsCreature: true } }
    },
    {
        id: 'damage-player',
        title: 'Deals direct damage to players',
        group: 'Damage',
        exceptions: [REDIRECTED_DAMAGE],
        match: { ...DIRECT_DAMAGE, phrases: { hitsPlayer: true } }
    },
    {
        id: 'bite',
        title: 'Creature deals damage equal to its power',
        group: 'Damage',
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
        match: { kind: 'FightEffect', phrases: { isOpposingObject: true } }
    }
];
