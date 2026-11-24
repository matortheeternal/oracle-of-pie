import TriggerEvent from './TriggerEvent.js';

const MUTATES = /^(?<subject>.+?) mutates\b/i;

export default class MutatesEvent extends TriggerEvent {
    static get pattern() {
        return MUTATES;
    }
}
