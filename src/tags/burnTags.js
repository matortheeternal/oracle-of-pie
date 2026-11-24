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
        tag: 'burn-planeswalker',
        match: {
            kind: 'DamageEffect',
            phrases: {
                refersToSelf: false,
                controlledByYou: false,
                any: [{ isAnyTarget: true }, { hasExactType: 'planeswalker' }]
            }
        }
    },
    {
        tag: 'burn-player-each',
        match: { kind: 'DamageEffect', phrases: { player: 'each player' } }
    },
    {
        tag: 'burn-you',
        match: {
            kind: 'DamageEffect',
            phrases: { isPlayer: true, isYou: true },
            context: { not: { abilityController: 'opponent' } }
        }
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
