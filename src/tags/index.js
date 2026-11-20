import { REMOVAL_TAGS } from './removalTags.js';
import { BURN_TAGS } from './burnTags.js';
import { CARD_FLOW_TAGS } from './cardFlowTags.js';
import { DRAW_TAGS } from './drawTags.js';
import { WHEEL_TAGS } from './wheelTags.js';
import { DISCARD_TAGS } from './discardTags.js';
import { COUNTER_TAGS } from './counterTags.js';
import { UNTAP_TAGS } from './untapTags.js';
import { PUMP_TAGS } from './pumpTags.js';
import { LIFE_TAGS } from './lifeTags.js';
import { TURN_TAGS } from './turnTags.js';
import { VANILLA_TAGS } from './vanillaTags.js';
import { EVASION_TAGS } from './evasionTags.js';
import { LIBRARY_TAGS } from './libraryTags.js';
import { CREATURE_TAGS } from './creatureTags.js';
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
import { CRIME_TAGS } from './crimeTags.js';
import { SOURCE_CASTING_TAGS } from './sourceCastingTags.js';
import { CASTING_MANA_TAGS } from './castingManaTags.js';
import { ENTRY_TAGS } from './entryTags.js';

export const DEFAULT_TAG_SPECS = [
    ...REMOVAL_TAGS,
    ...BURN_TAGS,
    ...CARD_FLOW_TAGS,
    ...DRAW_TAGS,
    ...WHEEL_TAGS,
    ...DISCARD_TAGS,
    ...COUNTER_TAGS,
    ...UNTAP_TAGS,
    ...PUMP_TAGS,
    ...LIFE_TAGS,
    ...TURN_TAGS,
    ...VANILLA_TAGS,
    ...EVASION_TAGS,
    ...LIBRARY_TAGS,
    ...CREATURE_TAGS,
    ...BOARD_TAGS,
    ...KEYWORD_GRANT_TAGS,
    ...KEYWORD_FAMILY_TAGS,
    ...MANA_TAGS,
    ...MANA_SINK_TAGS,
    ...SACRIFICE_TAGS,
    ...PLAYER_TAGS,
    ...SPELL_TAGS,
    ...ATTACK_TAGS,
    ...CRIME_TAGS,
    ...SOURCE_CASTING_TAGS,
    ...CASTING_MANA_TAGS,
    ...ENTRY_TAGS,
    ...STRUCTURE_TAGS,
    ...DERIVED_TAGS
];
