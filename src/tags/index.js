import { REMOVAL_TAGS } from './removalTags.js';
import { BURN_TAGS } from './burnTags.js';
import { CARD_FLOW_TAGS } from './cardFlowTags.js';
import { DRAW_TAGS } from './drawTags.js';
import { LIBRARY_TAGS } from './libraryTags.js';
import { CREATURE_TAGS } from './creatureTags.js';
import { BOARD_TAGS } from './boardTags.js';
import { STRUCTURE_TAGS } from './structureTags.js';
import { DERIVED_TAGS } from './derivedTags.js';

export const DEFAULT_TAG_SPECS = [
    ...REMOVAL_TAGS,
    ...BURN_TAGS,
    ...CARD_FLOW_TAGS,
    ...DRAW_TAGS,
    ...LIBRARY_TAGS,
    ...CREATURE_TAGS,
    ...BOARD_TAGS,
    ...STRUCTURE_TAGS,
    ...DERIVED_TAGS
];
