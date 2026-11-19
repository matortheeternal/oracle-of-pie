import ControllerModifier from './ControllerModifier.js';
import ZoneModifier from './ZoneModifier.js';
import KeywordModifier from './KeywordModifier.js';
import WithModifier from './WithModifier.js';
import StateModifier from './StateModifier.js';
import RelationModifier from './RelationModifier.js';

export const MODIFIER_PARSERS = [
    ControllerModifier, ZoneModifier, RelationModifier, KeywordModifier, WithModifier,
    StateModifier
];
