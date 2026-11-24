import GainControlEffect from './GainControlEffect.js';

const STATIC_CONTROL = /^controls? (?=enchanted|equipped)/i;

export default class StaticControlEffect extends GainControlEffect {
    static get pattern() {
        return STATIC_CONTROL;
    }
}
