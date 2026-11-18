import PhaseEvent from './PhaseEvent.js';
import CastEvent from './CastEvent.js';
import EntersOrDiesEvent from './EntersOrDiesEvent.js';
import DiesEvent from './DiesEvent.js';
import EntersEvent from './EntersEvent.js';
import AttacksEvent from './AttacksEvent.js';
import DealsDamageEvent from './DealsDamageEvent.js';
import TargetedEvent from './TargetedEvent.js';
import OtherEvent from './OtherEvent.js';

export const TRIGGER_EVENTS = [
    PhaseEvent, CastEvent, EntersOrDiesEvent, DiesEvent, EntersEvent, AttacksEvent,
    DealsDamageEvent, TargetedEvent, OtherEvent
];

export function parseTriggerEvent(text) {
    for (const eventClass of TRIGGER_EVENTS) {
        const match = eventClass.match(text);
        if (match) return new eventClass(text, match);
    }
    return null;
}
