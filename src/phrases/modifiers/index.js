import ControllerModifier from './ControllerModifier.js';
import ZoneModifier from './ZoneModifier.js';
import WithModifier from './WithModifier.js';
import StateModifier from './StateModifier.js';
import RelationModifier from './RelationModifier.js';

export const MODIFIER_PARSERS = [
    ControllerModifier, ZoneModifier, RelationModifier, WithModifier, StateModifier
];
