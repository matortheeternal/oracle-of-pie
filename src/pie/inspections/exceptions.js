import { PRIMARY, SECONDARY, TERTIARY } from '../ColorTier.js';

const FLYING = { requiresKeyword: 'flying' };
const FLYING_TARGET = { phrases: FLYING };

export const FLYER_REMOVAL = {
    id: 'flying',
    title: 'Creatures with flying',
    match: { any: [FLYING_TARGET, { subject: FLYING }] },
    tiers: { G: PRIMARY }
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

export const COMBATANT_DAMAGE = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: {
        phrases: { any: [{ hasQualifier: 'attacking' }, { hasQualifier: 'blocking' }] }
    },
    tiers: { W: SECONDARY }
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
    tiers: { W: PRIMARY }
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
    tiers: { B: PRIMARY, R: PRIMARY }
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
