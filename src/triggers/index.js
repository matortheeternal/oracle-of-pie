import CompoundEvent from './CompoundEvent.js';
import OtherEvent from './OtherEvent.js';
import { SIMPLE_EVENTS } from './simpleEvents.js';

export const TRIGGER_EVENTS = [CompoundEvent, ...SIMPLE_EVENTS, OtherEvent];
