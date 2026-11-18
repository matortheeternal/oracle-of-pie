import { REMOVAL_INSPECTIONS } from './removalInspections.js';
import { DAMAGE_INSPECTIONS } from './damageInspections.js';
import { RESOURCE_INSPECTIONS } from './resourceInspections.js';
import { CREATURE_INSPECTIONS } from './creatureInspections.js';

export const DEFAULT_PIE_INSPECTIONS = [
    ...REMOVAL_INSPECTIONS,
    ...DAMAGE_INSPECTIONS,
    ...RESOURCE_INSPECTIONS,
    ...CREATURE_INSPECTIONS
];
