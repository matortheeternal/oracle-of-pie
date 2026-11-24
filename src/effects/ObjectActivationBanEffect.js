import Effect from './Effect.js';

const OBJECT_ACTIVATION_BAN = /^(?:its|their) activated abilities can't be activated\b/i;

export default class ObjectActivationBanEffect extends Effect {
    static get pattern() {
        return OBJECT_ACTIVATION_BAN;
    }
}
