import TriggerEvent from './TriggerEvent.js';
import TransformedFace from './objects/TransformedFace.js';

const TRANSFORMS = /^(?<subject>.+?) transforms?\b/i;

export default class TransformsEvent extends TriggerEvent {
    static get pattern() {
        return TRANSFORMS;
    }

    parseObjectPhrase() {
        return this.consume([TransformedFace]);
    }

    get face() {
        return this.objectPhrase;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}
