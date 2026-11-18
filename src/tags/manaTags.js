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

const REPEATED_MANA_TRIGGER = {
    granted: false,
    expansion: null,
    ability: { kind: 'TriggeredAbility', isRepeatable: true }
};
const MANA_TOKEN = { tokenDefinitions: { name: ['Treasure', 'Gold', 'Powerstone'] } };

const RAMP_TAGS = [
    'land-ramp', 'mana-dork', 'mana-rock', 'mana-producer', 'ritual', 'combat-ramp'
];
const COMBAT_TRIGGER = {
    granted: false,
    ability: {
        kind: 'TriggeredAbility',
        event: {
            any: [{ kind: 'AttacksEvent' }, { kind: 'DealsDamageEvent', isCombat: true }]
        }
    }
};

export const MANA_TAGS = [
    {
        tag: 'mana-dork',
        match: {
            card: { isCreature: true },
            any: [
                { kind: 'AddManaEffect', context: FREE_MANA_ABILITY },
                { kind: 'CreateTokenEffect', ...MANA_TOKEN, context: FREE_MANA_ABILITY }
            ]
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
        tag: 'mana-producer',
        match: {
            kind: 'AddManaEffect',
            card: { isLand: false },
            context: REPEATED_MANA_TRIGGER
        }
    },
    {
        tag: 'combat-ramp',
        match: {
            any: [
                { kind: 'AddManaEffect', context: COMBAT_TRIGGER },
                { kind: 'CreateTokenEffect', ...MANA_TOKEN, context: COMBAT_TRIGGER }
            ]
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
                { tag: RAMP_TAGS },
                { kind: 'AddManaEffect', context: YOUR_TOKEN_MANA },
                { kind: 'AddManaEffect', context: GRANTED_MANA }
            ]
        }
    }
];
