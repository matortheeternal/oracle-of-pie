import * as removal from './rules/removalRules.js';
import * as burn from './rules/burnRules.js';
import * as cardFlow from './rules/cardFlowRules.js';
import * as library from './rules/libraryRules.js';
import * as creature from './rules/creatureRules.js';

export const TAG_RULES = [
    ...Object.values(removal), ...Object.values(burn), ...Object.values(cardFlow),
    ...Object.values(library), ...Object.values(creature)
];
