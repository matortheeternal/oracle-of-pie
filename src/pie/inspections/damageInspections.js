import { allow } from '../conditions/index.js';
import {
    FLYING_CREATURES, COMBATANT_CREATURES, TAPPED_CREATURES
} from '../conditions/targetConditions.js';
import {
    STAT_SCALED, CREATURE_COUNT_SCALED, REDIRECTED
} from '../conditions/damageConditions.js';

const ANY_TARGET_DAMAGE = 'Deal N damage to creature, planeswalker, and/or player.';
const DIRECT_DAMAGE = { kind: 'DamageEffect', isPowerBased: false };
const REDIRECTED_DAMAGE = allow(REDIRECTED, ['W'], 'Damage redirection');

export const DAMAGE_INSPECTIONS = [
    {
        id: 'damage-creature',
        title: 'Deals direct damage to creatures',
        group: 'Damage',
        cites: ANY_TARGET_DAMAGE,
        citationOmits: ['W'],
        exceptions: [
            REDIRECTED_DAMAGE,
            allow(FLYING_CREATURES, ['G']),
            allow(STAT_SCALED, ['G']),
            allow(CREATURE_COUNT_SCALED, ['W']),
            allow(
                COMBATANT_CREATURES, ['W'],
                'Deal N damage to target attacking or blocking creature.'
            ),
            allow(TAPPED_CREATURES, ['W'])
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
