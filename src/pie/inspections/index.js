import { REMOVAL_INSPECTIONS } from './removalInspections.js';
import { DAMAGE_INSPECTIONS } from './damageInspections.js';
import { RESOURCE_INSPECTIONS } from './resourceInspections.js';
import { CREATURE_INSPECTIONS } from './creatureInspections.js';
import { CARD_FLOW_INSPECTIONS } from './cardFlowInspections.js';
import { COMBAT_INSPECTIONS } from './combatInspections.js';
import { SUPPORT_INSPECTIONS } from './supportInspections.js';
import { keywordInspections } from './keywordInspection.js';
import { KEYWORD_TIERS, KEYWORD_EXCEPTIONS } from './keywordTiers.js';

export const DEFAULT_PIE_INSPECTIONS = [
    ...REMOVAL_INSPECTIONS,
    ...DAMAGE_INSPECTIONS,
    ...RESOURCE_INSPECTIONS,
    ...CREATURE_INSPECTIONS,
    ...CARD_FLOW_INSPECTIONS,
    ...COMBAT_INSPECTIONS,
    ...SUPPORT_INSPECTIONS,
    ...keywordInspections(KEYWORD_TIERS, KEYWORD_EXCEPTIONS)
];
