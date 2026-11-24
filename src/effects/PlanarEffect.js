import Effect from './Effect.js';

const PLANAR_ACTION = /^(planeswalk|chaos ensues)\b/i;

export default class PlanarEffect extends Effect {
    static get pattern() {
        return PLANAR_ACTION;
    }

    parseArguments(match) {
        this.action = match[1].toLowerCase();
    }

    get isPlaneswalk() {
        return this.action === 'planeswalk';
    }
}
