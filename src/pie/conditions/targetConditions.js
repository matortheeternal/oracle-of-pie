import PieCondition from './PieCondition.js';
import { CREATURE_TARGETING_GROUPS } from './scopes.js';

const FLYING = { requiresKeyword: 'flying' };
const COMBATANTS = {
    phrases: { any: [{ hasQualifier: 'attacking' }, { hasQualifier: 'blocking' }] }
};

export const FLYING_CREATURES = new PieCondition({
    id: 'flying',
    title: 'Creatures with flying',
    match: { any: [{ phrases: FLYING }, { subject: FLYING }] },
    groups: CREATURE_TARGETING_GROUPS
});

export const COMBATANT_CREATURES = new PieCondition({
    id: 'attacking-or-blocking',
    title: 'Attacking or blocking creatures',
    match: COMBATANTS,
    groups: CREATURE_TARGETING_GROUPS
});

export const TAPPED_CREATURES = new PieCondition({
    id: 'tapped',
    title: 'Tapped creatures',
    match: { phrases: { hasQualifier: 'tapped' } },
    groups: CREATURE_TARGETING_GROUPS
});

export const DEFENDER_CREATURES = new PieCondition({
    id: 'defender',
    title: 'Creatures with defender',
    match: { phrases: { requiresKeyword: 'defender' } },
    groups: CREATURE_TARGETING_GROUPS
});
