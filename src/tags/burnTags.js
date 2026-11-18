export const BURN_TAGS = [
    {
        tag: 'burn-creature',
        match: { kind: 'DamageEffect', phrases: { hitsCreature: true } }
    },
    {
        tag: 'burn-player',
        match: { kind: 'DamageEffect', phrases: { hitsPlayer: true } }
    },
    {
        tag: 'burn-any',
        match: { kind: 'DamageEffect', phrases: { isAnyTarget: true } }
    },
    {
        tag: 'one-sided-fight',
        match: {
            kind: 'DamageEffect',
            isPowerBased: true,
            phrases: { isAnyTarget: false, hitsCreature: true }
        }
    },
    {
        tag: 'removal-fight',
        match: { kind: 'FightEffect' }
    }
];
