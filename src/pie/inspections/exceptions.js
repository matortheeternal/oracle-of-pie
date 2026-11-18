import { PRIMARY, SECONDARY, TERTIARY } from '../ColorTier.js';

const FLYING_TARGET = { phrases: { requiresKeyword: 'flying' } };

export const FLYER_DESTRUCTION = {
    id: 'flying',
    title: 'Creatures with flying',
    match: FLYING_TARGET,
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

export const COMBATANT_DAMAGE = {
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: {
        phrases: { any: [{ hasQualifier: 'attacking' }, { hasQualifier: 'blocking' }] }
    },
    tiers: { W: SECONDARY }
};

export const NON_MANA_WARD = {
    id: 'non-mana-cost',
    title: 'Non-mana ward costs',
    match: { kind: 'KeywordAbility', not: { hasManaCostKeyword: 'ward' } },
    tiers: { B: PRIMARY }
};
