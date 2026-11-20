import TriggerEvent from './TriggerEvent.js';

const PROLIFERATES = /^(?<subject>.+?) proliferates?\b/i;

export default class ProliferatesEvent extends TriggerEvent {
    static get pattern() {
        return PROLIFERATES;
    }
}
