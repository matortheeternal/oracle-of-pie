const FREE_MANA_ABILITY = {
    granted: false,
    ability: { kind: 'ActivatedAbility', isRepeatable: true, cost: { paysMana: false } }
};
const YOUR_TOKEN_MANA = { expansion: { isToken: true }, forOpponent: false };
const GRANTED_MANA = {
    granted: true,
    expansion: null,
    forOpponent: null,
    card: { isLand: false },
    not: { parentEffect: { subject: { hasType: 'land' } } }
};

export const MANA_TAGS = [
    {
        tag: 'mana-dork',
        match: {
            kind: 'AddManaEffect',
            card: { isCreature: true },
            context: FREE_MANA_ABILITY
        }
    },
    {
        tag: 'mana-rock',
        match: {
            kind: 'AddManaEffect',
            card: { isArtifact: true, isCreature: false, isLand: false },
            context: FREE_MANA_ABILITY
        }
    },
    {
        tag: 'ritual',
        match: {
            kind: 'AddManaEffect',
            card: { isInstantOrSorcery: true },
            context: { ability: { kind: 'SpellAbility' }, expansion: null }
        }
    },
    {
        tag: 'ramp',
        match: {
            any: [
                { tag: ['land-ramp', 'mana-dork', 'mana-rock', 'ritual'] },
                { kind: 'AddManaEffect', context: YOUR_TOKEN_MANA },
                { kind: 'AddManaEffect', context: GRANTED_MANA }
            ]
        }
    }
];
