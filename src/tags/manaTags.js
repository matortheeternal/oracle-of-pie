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
const SACRIFICE_EVENT = { events: { kind: 'SacrificesEvent' } };
const MANA_TAP_EVENT = { events: { kind: ['TapsEvent', 'TappedForManaEvent'] } };
const MANA_PRODUCTION_EVENT = {
    events: {
        any: [{ kind: 'TappedForManaEvent' }, { kind: 'TapsEvent', isForMana: true }]
    }
};
const SACRIFICE_MANA = {
    ...REPEATED_MANA_TRIGGER,
    ability: { ...REPEATED_MANA_TRIGGER.ability, ...SACRIFICE_EVENT }
};

const RAMP_TAGS = [
    'land-ramp', 'mana-dork', 'mana-rock', 'mana-producer', 'ritual', 'combat-ramp'
];
const COMBAT_TRIGGER = {
    granted: false,
    ability: {
        kind: 'TriggeredAbility',
        events: {
            any: [{ kind: 'AttacksEvent' }, { kind: 'DealsDamageEvent', isCombat: true }]
        }
    }
};

const COMBAT_MANA_TOKEN = {
    kind: 'CreateTokenEffect', ...MANA_TOKEN, context: COMBAT_TRIGGER
};
const CONTROLLER_RECIPIENT = { subject: { isObjectController: true } };
const ANY_COLOR_MANA = new RegExp(
    '^(?:one|two|three) mana of any (?:one )?color'
        + '(?: in your commander\'s color identity)?$',
    'i'
);
const ONE_MANA = new RegExp(
    '^(?:\\{[WUBRGC]\\}(?: or \\{[WUBRGC]\\})*|one mana of any (?:one )?color)$',
    'i'
);
const TWO_DISTINCT_COLORS = /^\{([WUBRG])\}\{(?!\1)[WUBRG]\}$/i;
const ONE_GENERIC_WITH_TAP = /^(?:\{1\},? \{T\}|\{T\},? \{1\})$/i;
const FIXED_MULTIPLE_MANA = new RegExp(
    '^(?:(?:\\{[WUBRGC]\\}){2,}'
        + '|(?:two|three|four|five|six|seven|eight|nine|ten) '
        + '(?:mana(?: .+)?|\\{[WUBRGC]\\}))$',
    'i'
);
const PAY_ENERGY = /^pay (?:\{E\})+$/i;
const PRINTED_ACTIVATION = { granted: false, expansion: null };
const LAND_MANA = { kind: 'AddManaEffect', card: { isLand: true }, subjectIsYou: true };
const SELF_DAMAGE = {
    kind: 'DamageEffect',
    subject: { refersToSelf: true },
    phrases: { isYou: true }
};
const SAME_COLOR_EXCHANGES = [...'WUBRGC'].map(color => ({
    mana: `{${color}}`,
    context: {
        ability: {
            cost: {
                items: { kind: 'ManaCostItem', symbols: new RegExp(`\\{${color}\\}`) }
            }
        }
    }
}));

export const MANA_TAGS = [
    {
        tag: 'rainbow-land',
        match: {
            ...LAND_MANA,
            mana: ANY_COLOR_MANA,
            context: {
                ...PRINTED_ACTIVATION,
                ability: {
                    kind: 'ActivatedAbility',
                    cost: { paysMana: false, includesTap: true, removesCounters: false }
                }
            }
        }
    },
    {
        tag: 'painland',
        match: {
            ...LAND_MANA,
            context: {
                ...PRINTED_ACTIVATION,
                ability: {
                    kind: 'ActivatedAbility',
                    cost: { includesTap: true },
                    any: [
                        { cost: { paysLife: true } },
                        { body: { effects: SELF_DAMAGE } }
                    ]
                }
            }
        }
    },
    {
        tag: 'mana-increaser',
        match: {
            kind: 'AddManaEffect',
            context: {
                ...REPEATED_MANA_TRIGGER,
                ability: { ...REPEATED_MANA_TRIGGER.ability, ...MANA_PRODUCTION_EVENT }
            }
        }
    },
    {
        tag: 'mana-filter',
        match: {
            kind: 'AddManaEffect',
            subjectIsYou: true,
            context: { ...PRINTED_ACTIVATION, ability: { kind: 'ActivatedAbility' } },
            any: [
                {
                    mana: ONE_MANA,
                    context: {
                        ability: { cost: { manaValue: 1, hasVariableMana: false } }
                    },
                    not: { any: SAME_COLOR_EXCHANGES }
                },
                {
                    mana: TWO_DISTINCT_COLORS,
                    context: { ability: { cost: { raw: ONE_GENERIC_WITH_TAP } } }
                }
            ]
        }
    },
    {
        tag: 'adds-multiple-mana',
        match: {
            kind: 'AddManaEffect',
            subjectIsYou: true,
            mana: FIXED_MULTIPLE_MANA,
            context: {
                ...PRINTED_ACTIVATION,
                ability: {
                    kind: 'ActivatedAbility',
                    cost: {
                        paysMana: false,
                        removesCounters: false,
                        not: {
                            items: { any: [{ kind: 'LoyaltyCost' }, { raw: PAY_ENERGY }] }
                        }
                    }
                }
            }
        }
    },
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
            context: {
                ...REPEATED_MANA_TRIGGER,
                not: { ability: { any: [SACRIFICE_EVENT, MANA_TAP_EVENT] } }
            }
        }
    },
    {
        tag: 'combat-ramp',
        match: {
            any: [
                { kind: 'AddManaEffect', context: COMBAT_TRIGGER },
                { ...COMBAT_MANA_TOKEN, not: CONTROLLER_RECIPIENT }
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
                { ...COMBAT_MANA_TOKEN, ...CONTROLLER_RECIPIENT },
                {
                    kind: 'AddManaEffect',
                    card: { isLand: false },
                    context: SACRIFICE_MANA
                },
                { kind: 'AddManaEffect', context: YOUR_TOKEN_MANA },
                { kind: 'AddManaEffect', context: GRANTED_MANA }
            ]
        }
    }
];
