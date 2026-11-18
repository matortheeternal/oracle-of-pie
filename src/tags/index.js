import { REMOVAL_TAGS } from './removalTags.js';
import { BURN_TAGS } from './burnTags.js';
import { CARD_FLOW_TAGS } from './cardFlowTags.js';
import { LIBRARY_TAGS } from './libraryTags.js';
import { CREATURE_TAGS } from './creatureTags.js';

export const DEFAULT_TAG_SPECS = [
    ...REMOVAL_TAGS, ...BURN_TAGS, ...CARD_FLOW_TAGS, ...LIBRARY_TAGS, ...CREATURE_TAGS
];
