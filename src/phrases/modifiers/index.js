import CleaveModifier from './CleaveModifier.js';
import ControllerModifier from './ControllerModifier.js';
import ZoneModifier from './ZoneModifier.js';
import KeywordModifier from './KeywordModifier.js';
import WithModifier from './WithModifier.js';
import StateModifier from './StateModifier.js';
import RelationModifier from './RelationModifier.js';
import NamedModifier from './NamedModifier.js';
import SpellTargetModifier from './SpellTargetModifier.js';
import AdventureModifier from '../../triggers/objects/AdventureModifier.js';

export const MODIFIER_PARSERS = [
    ControllerModifier, ZoneModifier, RelationModifier, KeywordModifier, WithModifier,
    AdventureModifier, NamedModifier, SpellTargetModifier, StateModifier, CleaveModifier
];
