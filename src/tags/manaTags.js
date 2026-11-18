const FREE_MANA_ABILITY = {
    granted: false,
    ability: { kind: 'ActivatedAbility', isRepeatable: true, cost: { paysMana: false } }
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
        tag: 'ramp',
        match: { tag: ['land-ramp', 'mana-dork', 'mana-rock'] }
    }
];
