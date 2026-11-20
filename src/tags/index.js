import { ARTIFACT_HATE_TAGS } from './artifactHateTags.js';
import { REMOVAL_TAGS } from './removalTags.js';
import { BURN_TAGS } from './burnTags.js';
import { CARD_FLOW_TAGS } from './cardFlowTags.js';
import { DRAW_TAGS } from './drawTags.js';
import { WHEEL_TAGS } from './wheelTags.js';
import { DISCARD_TAGS } from './discardTags.js';
import { HAND_DEPENDENCY_TAGS } from './handDependencyTags.js';
import { COUNTER_TAGS } from './counterTags.js';
import { UNTAP_TAGS } from './untapTags.js';
import { PUMP_TAGS } from './pumpTags.js';
import { LIFE_TAGS } from './lifeTags.js';
import { TURN_TAGS } from './turnTags.js';
import { VANILLA_TAGS } from './vanillaTags.js';
import { EVASION_TAGS } from './evasionTags.js';
import { LIBRARY_TAGS } from './libraryTags.js';
import { GRAVEYARD_RETURN_TAGS } from './graveyardReturnTags.js';
import { GRAVEYARD_TAGS } from './graveyardTags.js';
import { CREATURE_TAGS } from './creatureTags.js';
import { CREATURE_STAT_TAGS } from './creatureStatTags.js';
import { BOARD_TAGS } from './boardTags.js';
import { STRUCTURE_TAGS } from './structureTags.js';
import { DERIVED_TAGS } from './derivedTags.js';
import { KEYWORD_GRANT_TAGS } from './keywordGrantTags.js';
import { KEYWORD_FAMILY_TAGS } from './keywordFamilyTags.js';
import { MANA_TAGS } from './manaTags.js';
import { MANA_SINK_TAGS } from './manaSinkTags.js';
import { SACRIFICE_TAGS } from './sacrificeTags.js';
import { PLAYER_TAGS } from './playerTags.js';
import { SPELL_TAGS } from './spellTags.js';
import { ATTACK_TAGS } from './attackTags.js';
import { COMBAT_RESTRICTION_TAGS } from './combatRestrictionTags.js';
import { COMBAT_HAZARD_TAGS } from './combatHazardTags.js';
import { MULTI_TARGET_TAGS } from './multiTargetTags.js';
import { CRIME_TAGS } from './crimeTags.js';
import { SOURCE_CASTING_TAGS } from './sourceCastingTags.js';
import { CASTING_MANA_TAGS } from './castingManaTags.js';
import { ENTRY_TAGS } from './entryTags.js';
import { ZONE_PERMISSION_TAGS } from './zonePermissionTags.js';
import { TYPEFALL_TAGS } from './typefallTags.js';
import { OBJECT_SYNERGY_TAGS } from './objectSynergyTags.js';
import { PROTECTION_TAGS } from './protectionTags.js';
import { COUNTER_SYNERGY_TAGS } from './counterSynergyTags.js';
import { ORDINAL_EVENT_TAGS } from './ordinalEventTags.js';
import { TRIGGERED_PAYOFF_TAGS } from './triggeredPayoffTags.js';
import { ANIMATION_TAGS } from './animationTags.js';
import { RULES_EFFECT_TAGS } from './rulesEffectTags.js';
import { DEPENDENCY_TAGS } from './dependencyTags.js';

import { DEPARTURE_TAGS } from './departureTags.js';
import { FORM_TAGS } from './formTags.js';
import { GROWTH_TAGS } from './growthTags.js';
import { REPLACEMENT_TAGS } from './replacementTags.js';
import { RESOURCE_TAGS } from './resourceTags.js';

export const DEFAULT_TAG_SPECS = [
    ...REMOVAL_TAGS,
    ...ARTIFACT_HATE_TAGS,
    ...BURN_TAGS,
    ...CARD_FLOW_TAGS,
    ...DRAW_TAGS,
    ...WHEEL_TAGS,
    ...DISCARD_TAGS,
    ...HAND_DEPENDENCY_TAGS,
    ...COUNTER_TAGS,
    ...COUNTER_SYNERGY_TAGS,
    ...ORDINAL_EVENT_TAGS,
    ...UNTAP_TAGS,
    ...PUMP_TAGS,
    ...LIFE_TAGS,
    ...TURN_TAGS,
    ...VANILLA_TAGS,
    ...EVASION_TAGS,
    ...LIBRARY_TAGS,
    ...GRAVEYARD_RETURN_TAGS,
    ...GRAVEYARD_TAGS,
    ...CREATURE_TAGS,
    ...CREATURE_STAT_TAGS,
    ...DEPENDENCY_TAGS,
    ...GROWTH_TAGS,
    ...REPLACEMENT_TAGS,
    ...BOARD_TAGS,
    ...ANIMATION_TAGS,
    ...FORM_TAGS,
    ...DEPARTURE_TAGS,
    ...KEYWORD_GRANT_TAGS,
    ...KEYWORD_FAMILY_TAGS,
    ...MANA_TAGS,
    ...MANA_SINK_TAGS,
    ...SACRIFICE_TAGS,
    ...PLAYER_TAGS,
    ...SPELL_TAGS,
    ...RULES_EFFECT_TAGS,
    ...ATTACK_TAGS,
    ...COMBAT_RESTRICTION_TAGS,
    ...COMBAT_HAZARD_TAGS,
    ...MULTI_TARGET_TAGS,
    ...CRIME_TAGS,
    ...SOURCE_CASTING_TAGS,
    ...CASTING_MANA_TAGS,
    ...ENTRY_TAGS,
    ...TYPEFALL_TAGS,
    ...OBJECT_SYNERGY_TAGS,
    ...PROTECTION_TAGS,
    ...STRUCTURE_TAGS,
    ...TRIGGERED_PAYOFF_TAGS,
    ...ZONE_PERMISSION_TAGS,
    ...DERIVED_TAGS,
    ...RESOURCE_TAGS
];
