import { REMOVAL_TAGS } from './removalTags.js';
import { BURN_TAGS } from './burnTags.js';
import { CARD_FLOW_TAGS } from './cardFlowTags.js';
import { DRAW_TAGS } from './drawTags.js';
import { WHEEL_TAGS } from './wheelTags.js';
import { LIBRARY_TAGS } from './libraryTags.js';
import { CREATURE_TAGS } from './creatureTags.js';
import { BOARD_TAGS } from './boardTags.js';
import { STRUCTURE_TAGS } from './structureTags.js';
import { DERIVED_TAGS } from './derivedTags.js';
import { KEYWORD_GRANT_TAGS } from './keywordGrantTags.js';
import { KEYWORD_FAMILY_TAGS } from './keywordFamilyTags.js';
import { MANA_TAGS } from './manaTags.js';
import { SACRIFICE_TAGS } from './sacrificeTags.js';
import { PLAYER_TAGS } from './playerTags.js';
import { SPELL_TAGS } from './spellTags.js';

export const DEFAULT_TAG_SPECS = [
    ...REMOVAL_TAGS,
    ...BURN_TAGS,
    ...CARD_FLOW_TAGS,
    ...DRAW_TAGS,
    ...WHEEL_TAGS,
    ...LIBRARY_TAGS,
    ...CREATURE_TAGS,
    ...BOARD_TAGS,
    ...KEYWORD_GRANT_TAGS,
    ...KEYWORD_FAMILY_TAGS,
    ...MANA_TAGS,
    ...SACRIFICE_TAGS,
    ...PLAYER_TAGS,
    ...SPELL_TAGS,
    ...STRUCTURE_TAGS,
    ...DERIVED_TAGS
];
