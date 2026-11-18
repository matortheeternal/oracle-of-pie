const DIRECT_DAMAGE = { kind: 'DamageEffect', isPowerBased: false };

export const DAMAGE_INSPECTIONS = [
    {
        id: 'damage-creature',
        title: 'Deals direct damage to creatures',
        match: { ...DIRECT_DAMAGE, phrases: { hitsCreature: true } }
    },
    {
        id: 'damage-player',
        title: 'Deals direct damage to players',
        match: { ...DIRECT_DAMAGE, phrases: { hitsPlayer: true } }
    },
    {
        id: 'bite',
        title: 'Creature deals damage equal to its power',
        match: {
            kind: 'DamageEffect',
            isPowerBased: true,
            phrases: { isAnyTarget: false, hitsCreature: true }
        }
    },
    {
        id: 'fight',
        title: 'Fights',
        match: { kind: 'FightEffect' }
    }
];
