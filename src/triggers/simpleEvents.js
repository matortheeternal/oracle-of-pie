import PhaseEvent from './PhaseEvent.js';
import CastEvent from './CastEvent.js';
import DiesEvent from './DiesEvent.js';
import EntersEvent from './EntersEvent.js';
import AttacksEvent from './AttacksEvent.js';
import DealsDamageEvent from './DealsDamageEvent.js';
import TargetedEvent from './TargetedEvent.js';
import DamagePreventedEvent from './DamagePreventedEvent.js';

export const SIMPLE_EVENTS = [
    PhaseEvent, CastEvent, EntersEvent, AttacksEvent, DiesEvent, DealsDamageEvent,
    TargetedEvent, DamagePreventedEvent
];

export function readSimpleEvent(scribe, str) {
    for (const event of SIMPLE_EVENTS) {
        const match = event.match(scribe, str);
        if (match) return event.read(scribe, match, str);
    }
    return null;
}
