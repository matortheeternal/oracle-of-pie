import PieCondition from './PieCondition.js';
import SubtypeCondition from './SubtypeCondition.js';
import {
    FLYING_CREATURES, COMBATANT_CREATURES, TAPPED_CREATURES, DEFENDER_CREATURES
} from './targetConditions.js';
import { RANDOM_REPLACEMENT, TOKEN_REPLACEMENT } from './replacementConditions.js';
import { STAT_SCALED, CREATURE_COUNT_SCALED, REDIRECTED } from './damageConditions.js';
import { LIFE_COST, NON_MANA_COST, SACRIFICE_COST } from './costConditions.js';
import {
    EXTRA_ATTACK, UNTAPPED_CREATURES, WITH_UNBLOCKABLE
} from './combatConditions.js';
import { WHEEL } from './cardFlowConditions.js';

export const CREATURE_TYPE = new SubtypeCondition({
    id: 'creature-type',
    title: 'Creature type'
});

export const PIE_CONDITIONS = [
    FLYING_CREATURES, COMBATANT_CREATURES, TAPPED_CREATURES, DEFENDER_CREATURES,
    RANDOM_REPLACEMENT, TOKEN_REPLACEMENT,
    STAT_SCALED, CREATURE_COUNT_SCALED, REDIRECTED,
    LIFE_COST, NON_MANA_COST, SACRIFICE_COST,
    EXTRA_ATTACK, UNTAPPED_CREATURES, WITH_UNBLOCKABLE,
    WHEEL,
    CREATURE_TYPE
];

const BY_ID = new Map(PIE_CONDITIONS.map(condition => [condition.id, condition]));

export function conditionFor(spec) {
    if (!spec.condition) return new PieCondition(spec);
    return BY_ID.get(spec.condition) ?? null;
}

export function allow(condition, colors, cites) {
    return { condition: condition.id, colors, cites };
}
