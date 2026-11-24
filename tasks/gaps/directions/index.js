import OpaqueDirection from './OpaqueDirection.js';
import IncompleteDirection from './IncompleteDirection.js';
import UnsupportedEventDirection from './UnsupportedEventDirection.js';
import UnreadEventDirection from './UnreadEventDirection.js';
import EffectlessClauseDirection from './EffectlessClauseDirection.js';
import CostStartDirection from './CostStartDirection.js';
import StartDirection from './StartDirection.js';
import AfterEffectDirection from './AfterEffectDirection.js';
import AfterNodeDirection from './AfterNodeDirection.js';

export const GAP_DIRECTIONS = [
    OpaqueDirection, IncompleteDirection, UnsupportedEventDirection, UnreadEventDirection,
    EffectlessClauseDirection, CostStartDirection, StartDirection, AfterEffectDirection,
    AfterNodeDirection
];

export function directionFor(gap, sources) {
    const Direction = GAP_DIRECTIONS.find(candidate => candidate.matches(gap));
    return Direction ? new Direction(gap, sources) : null;
}
