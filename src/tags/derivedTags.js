const REMOVAL = [
    'removal-destroy', 'removal-exile', 'removal-bounce', 'removal-sacrifice',
    'removal-toughness', 'burn-creature', 'removal-fight', 'one-sided-fight'
];
const REPEATABLE = { ability: { isRepeatable: true } };

export const DERIVED_TAGS = [
    {
        tag: 'spot-removal',
        match: { tag: REMOVAL, phrases: { isTargeted: true, isMass: false } }
    },
    {
        tag: 'removal-creature',
        match: { tag: REMOVAL, phrases: { hasType: 'creature' } }
    },
    {
        tag: 'repeatable-removal',
        match: { tag: REMOVAL, context: REPEATABLE }
    },
    {
        tag: 'repeatable-pure-draw',
        match: { tag: 'pure-draw', context: REPEATABLE }
    },
    {
        tag: 'repeatable-lifegain',
        match: { tag: 'lifegain', context: REPEATABLE }
    },
    {
        tag: 'repeatable-creature-tokens',
        match: {
            kind: 'CreateTokenEffect',
            createsCreature: true,
            affectsYou: true,
            context: REPEATABLE
        }
    }
];
