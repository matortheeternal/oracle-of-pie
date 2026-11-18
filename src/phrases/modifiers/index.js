import ControllerModifier from './ControllerModifier.js';
import ZoneModifier from './ZoneModifier.js';
import WithModifier from './WithModifier.js';
import StateModifier from './StateModifier.js';

export const MODIFIER_PARSERS = [
    ControllerModifier, ZoneModifier, WithModifier, StateModifier
];
