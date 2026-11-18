import { PRIMARY, SECONDARY, TERTIARY } from '../ColorTier.js';

const FLYING = { requiresKeyword: 'flying' };
const FLYING_TARGET = { phrases: FLYING };

export const FLYER_REMOVAL = {
    id: 'flying',
    title: 'Creatures with flying',
    match: { any: [FLYING_TARGET, { subject: FLYING }] },
    cites: 'Destroy target creature with flying'
};

export const FLYER_EXILE = {
    id: 'flying',
    title: 'Creatures with flying',
    match: FLYING_TARGET,
    tiers: { G: TERTIARY }
};

export const FLYER_DAMAGE = {
    id: 'flying',
    title: 'Creatures with flying',
    match: FLYING_TARGET,
    tiers: { G: PRIMARY, W: SECONDARY }
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
    tiers: { G: PRIMARY }
};

const COMBATANTS = {
    phrases: { any: [{ hasQualifier: 'attacking' }, { hasQualifier: 'blocking' }] }
};

export const COMBATANT_DAMAGE = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: COMBATANTS,
    cites: 'Deal N damage to target attacking or blocking creature.'
};

export const COMBATANT_REMOVAL = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: COMBATANTS,
    cites: 'Destroy target attacking or blocking creature.'
};

const PREVENTED_DAMAGE = { event: { kind: 'DamagePreventedEvent' } };
const PREVENTION_TRIGGERS = [
    { ability: PREVENTED_DAMAGE },
    { delayedTrigger: PREVENTED_DAMAGE }
];

export const REDIRECTED_DAMAGE = {
    id: 'redirection',
    title: 'Redirected prevented damage',
    match: { context: { any: PREVENTION_TRIGGERS } },
    cites: 'Damage redirection'
};

export const TAPPED_CREATURE_DAMAGE = {
    id: 'tapped',
    title: 'Tapped creatures',
    match: { phrases: { hasQualifier: 'tapped' } },
    tiers: { W: SECONDARY }
};

export const LIFE_WARD = {
    id: 'life-cost',
    title: 'Ward costs paid in life',
    match: { kind: 'KeywordAbility', paysLifeCost: true },
    cites: 'Ward (for life)'
};

const OPPONENT_DRAWS = { kind: 'DrawEffect', subject: { canBeOpponent: true } };

export const WHEEL = {
    id: 'wheel',
    title: 'Discarding paired with drawing',
    match: { context: { cardText: { effects: { any: [OPPONENT_DRAWS] } } } },
    cites: '"Wheeling"'
};

const EXTRA_COMBAT = { kind: 'AdditionalPhaseEffect', addsCombat: true };

export const EXTRA_ATTACK = {
    id: 'extra-attack',
    title: 'Untapping creatures for an additional combat',
    match: { context: { cardText: { effects: { any: [EXTRA_COMBAT] } } } },
    cites: 'Extra attack'
};

export const UNTAPPED_CREATURES = {
    id: 'creatures',
    title: 'Untapping creatures',
    match: { phrases: { hasExactType: 'creature' } },
    cites: 'Untapping creatures'
};

const UNBLOCKABLE_IN_SENTENCE = { kind: 'CantEffect', makesUnblockable: true };

export const EVASIVE_POWER_PUMP = {
    id: 'with-unblockable',
    title: 'Power boosts bundled with unblockability',
    match: { context: { sentence: { effects: { any: [UNBLOCKABLE_IN_SENTENCE] } } } },
    tiers: { U: TERTIARY }
};

const CONTROLLER_REVEALS_REPLACEMENT = {
    kind: 'RevealUntilEffect',
    subject: { canBeOpponent: true }
};
const REPLACED_FROM_LIBRARY = { effects: { any: [CONTROLLER_REVEALS_REPLACEMENT] } };

export const POLYMORPH = {
    id: 'polymorph',
    title: 'Replaced by a random card from its controller\'s library',
    match: { context: { cardText: REPLACED_FROM_LIBRARY } },
    cites: '"Polymorph"'
};

export const LAND_DESTRUCTION = {
    id: 'lands',
    title: 'Land creatures',
    match: { phrases: { hasType: 'land' } },
    cites: 'Land destruction'
};

export const WALL_REMOVAL = {
    id: 'defender',
    title: 'Creatures with defender',
    match: { phrases: { requiresKeyword: 'defender' } },
    tiers: { R: TERTIARY }
};

export const SACRIFICIAL_MANA = {
    id: 'sacrifice-cost',
    title: 'Mana paid for by sacrificing another permanent',
    match: { context: { ability: { cost: { sacrificesOther: true } } } },
    cites: 'Mana production, temporary'
};

export const NON_MANA_WARD = {
    id: 'non-mana-cost',
    title: 'Non-mana ward costs',
    match: { kind: 'KeywordAbility', not: { hasManaCostKeyword: 'ward' } },
    tiers: { B: PRIMARY }
};

function creatureTypeException(subtype, tiers) {
    const isType = { hasSubtype: subtype };
    return {
        id: subtype.toLowerCase(),
        title: `${subtype}s`,
        match: { any: [{ card: isType }, { subject: isType }, { phrases: isType }] },
        tiers
    };
}

export const DEMON_TRAMPLE = creatureTypeException('Demon', { B: SECONDARY });
