import ColorTiers from '../ColorTiers.js';
import { FLYER_DAMAGE, COMBATANT_DAMAGE } from './exceptions.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

const DIRECT_DAMAGE = { kind: 'DamageEffect', isPowerBased: false };

export const DAMAGE_INSPECTIONS = [
    {
        id: 'damage-creature',
        title: 'Deals direct damage to creatures',
        group: 'Damage',
        tiers: ColorTiers.of(TERTIARY, NONE, TERTIARY, PRIMARY, TERTIARY),
        description: 'Red owns direct damage. White hits attackers or flyers; green '
            + 'prefers fight and bite.',
        exceptions: [FLYER_DAMAGE, COMBATANT_DAMAGE],
        match: { ...DIRECT_DAMAGE, phrases: { hitsCreature: true } }
    },
    {
        id: 'damage-player',
        title: 'Deals direct damage to players',
        group: 'Damage',
        tiers: ColorTiers.of(TERTIARY, NONE, SECONDARY, PRIMARY, NONE),
        description: 'Red owns burn to face; black does it as drain.',
        match: { ...DIRECT_DAMAGE, phrases: { hitsPlayer: true } }
    },
    {
        id: 'bite',
        title: 'Creature deals damage equal to its power',
        group: 'Damage',
        tiers: ColorTiers.of(NONE, NONE, TERTIARY, SECONDARY, PRIMARY),
        description: 'Green owns one-sided creature damage.',
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
        tiers: ColorTiers.of(NONE, NONE, TERTIARY, SECONDARY, PRIMARY),
        description: 'Green owns fight; red is secondary.',
        match: { kind: 'FightEffect' }
    }
];
