import ControllerModifier from './ControllerModifier.js';
import ZoneModifier from './ZoneModifier.js';
import KeywordModifier from './KeywordModifier.js';
import WithModifier from './WithModifier.js';
import StateModifier from './StateModifier.js';
import RelationModifier from './RelationModifier.js';
import NamedModifier from './NamedModifier.js';
import AdventureModifier from '../../triggers/objects/AdventureModifier.js';

export const MODIFIER_PARSERS = [
    ControllerModifier, ZoneModifier, RelationModifier, KeywordModifier, WithModifier,
    AdventureModifier, NamedModifier, StateModifier
];
