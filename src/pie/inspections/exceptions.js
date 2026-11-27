const FLYING = { requiresKeyword: 'flying' };
const FLYING_TARGET = { phrases: FLYING };

export const FLYER_REMOVAL = {
    id: 'flying',
    title: 'Creatures with flying',
    match: { any: [FLYING_TARGET, { subject: FLYING }] },
    colors: ['G'],
    cites: 'Destroy target creature with flying'
};

export const FLYER_EXILE = {
    id: 'flying',
    title: 'Creatures with flying',
    match: FLYING_TARGET,
    colors: ['G']
};

export const FLYER_DAMAGE = {
    id: 'flying',
    title: 'Creatures with flying',
    match: FLYING_TARGET,
    colors: ['G']
};

export const STAT_SCALED_DAMAGE = {
    id: 'creature-stats',
    title: 'Damage scaled by a creature\'s power or toughness',
    match: {
        any: [
            { scalesWithCreatureStats: true },
            { context: { sentence: { definesXByCreatureStats: true } } }
        ]
    },
    colors: ['G']
};

export const CREATURE_COUNT_DAMAGE = {
    id: 'creature-count',
    title: 'Damage scaled by the number of creatures you control',
    match: {
        any: [
            { usesCreatureCount: true },
            { context: { sentence: { definesXByCreatureCount: true } } }
        ]
    },
    colors: ['W']
};

const COMBATANTS = {
    phrases: { any: [{ hasQualifier: 'attacking' }, { hasQualifier: 'blocking' }] }
};

export const COMBATANT_DAMAGE = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: COMBATANTS,
    colors: ['W'],
    cites: 'Deal N damage to target attacking or blocking creature.'
};

export const COMBATANT_REMOVAL = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: COMBATANTS,
    colors: ['W'],
    cites: 'Destroy target attacking or blocking creature.'
};

const PREVENTED_DAMAGE = { events: { kind: 'DamagePreventedEvent' } };
const PREVENTION_TRIGGERS = [
    { ability: PREVENTED_DAMAGE },
    { delayedTrigger: PREVENTED_DAMAGE }
];

export const REDIRECTED_DAMAGE = {
    id: 'redirection',
    title: 'Redirected prevented damage',
    match: { context: { any: PREVENTION_TRIGGERS } },
    colors: ['W'],
    cites: 'Damage redirection'
};

export const TAPPED_CREATURE_DAMAGE = {
    id: 'tapped',
    title: 'Tapped creatures',
    match: { phrases: { hasQualifier: 'tapped' } },
    colors: ['W']
};

export const LIFE_WARD = {
    id: 'life-cost',
    title: 'Ward costs paid in life',
    match: { kind: 'KeywordAbility', paysLifeCost: true },
    colors: ['R'],
    cites: 'Ward (for life)'
};

const OPPONENT_DRAWS = { kind: 'DrawEffect', subject: { canBeOpponent: true } };

export const WHEEL = {
    id: 'wheel',
    title: 'Discarding paired with drawing',
    match: { context: { cardText: { effects: { any: [OPPONENT_DRAWS] } } } },
    colors: ['R'],
    cites: '"Wheeling"'
};

const EXTRA_COMBAT = { kind: 'AdditionalPhaseEffect', addsCombat: true };

export const EXTRA_ATTACK = {
    id: 'extra-attack',
    title: 'Untapping creatures for an additional combat',
    match: { context: { cardText: { effects: { any: [EXTRA_COMBAT] } } } },
    colors: ['R'],
    cites: 'Extra attack'
};

export const UNTAPPED_CREATURES = {
    id: 'creatures',
    title: 'Untapping creatures',
    match: { phrases: { hasExactType: 'creature' } },
    colors: ['W', 'U', 'G'],
    cites: 'Untapping creatures'
};

const UNBLOCKABLE_IN_SENTENCE = { kind: 'CantEffect', makesUnblockable: true };

export const EVASIVE_POWER_PUMP = {
    id: 'with-unblockable',
    title: 'Power boosts bundled with unblockability',
    match: { context: { sentence: { effects: { any: [UNBLOCKABLE_IN_SENTENCE] } } } },
    colors: ['U']
};

const CONTROLLER_FINDS_RANDOM_CARD = {
    findsRandomCard: true,
    subject: { canBeOpponent: true }
};
const RANDOMLY_REPLACED = { effects: { any: [CONTROLLER_FINDS_RANDOM_CARD] } };

export const POLYMORPH = {
    id: 'polymorph',
    title: 'Replaced by a random card for its controller',
    match: { context: { cardText: RANDOMLY_REPLACED } },
    colors: ['R'],
    cites: '"Polymorph"'
};

const CONTROLLER_GETS_TOKEN = {
    kind: 'CreateTokenEffect',
    subject: { canBeOpponent: true }
};

export const TOKEN_EXCHANGE = {
    id: 'token-exchange',
    title: 'Replaced by a token for its controller',
    match: { context: { cardText: { effects: { any: [CONTROLLER_GETS_TOKEN] } } } },
    colors: ['U']
};

export const WALL_REMOVAL = {
    id: 'defender',
    title: 'Creatures with defender',
    match: { phrases: { requiresKeyword: 'defender' } },
    colors: ['R']
};

export const SACRIFICIAL_MANA = {
    id: 'sacrifice-cost',
    title: 'Mana paid for by sacrificing another permanent',
    match: { context: { ability: { cost: { sacrificesOther: true } } } },
    colors: ['B', 'R'],
    cites: 'Mana production, temporary'
};

export const NON_MANA_WARD = {
    id: 'non-mana-cost',
    title: 'Non-mana ward costs',
    match: { kind: 'KeywordAbility', not: { hasManaCostKeyword: 'ward' } },
    colors: ['B']
};

function creatureTypeException(subtype, colors) {
    const isType = { hasSubtype: subtype };
    return {
        id: subtype.toLowerCase(),
        title: `${subtype}s`,
        match: { any: [{ card: isType }, { subject: isType }, { phrases: isType }] },
        colors
    };
}

export const DEMON_TRAMPLE = creatureTypeException('Demon', ['B']);
