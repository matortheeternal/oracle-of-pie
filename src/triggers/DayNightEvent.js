import TriggerEvent from './TriggerEvent.js';

const DAY_NIGHT = /^day becomes night or night becomes day\b/i;

export default class DayNightEvent extends TriggerEvent {
    static get pattern() {
        return DAY_NIGHT;
    }
}
