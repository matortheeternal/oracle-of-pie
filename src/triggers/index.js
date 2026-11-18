import PhaseEvent from './PhaseEvent.js';
import CastEvent from './CastEvent.js';
import DiesEvent from './DiesEvent.js';
import EntersEvent from './EntersEvent.js';
import AttacksEvent from './AttacksEvent.js';
import DealsDamageEvent from './DealsDamageEvent.js';
import OtherEvent from './OtherEvent.js';

export const TRIGGER_EVENTS = [
    PhaseEvent, CastEvent, DiesEvent, EntersEvent, AttacksEvent, DealsDamageEvent,
    OtherEvent
];

export function parseTriggerEvent(text) {
    for (const eventClass of TRIGGER_EVENTS) {
        const match = eventClass.match(text);
        if (match) return new eventClass(text, match);
    }
    return null;
}
