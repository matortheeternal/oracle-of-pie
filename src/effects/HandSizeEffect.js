import Effect from './Effect.js';

const NO_MAXIMUM_HAND_SIZE = /^ha(?:ve|s) no maximum hand size/i;

export default class HandSizeEffect extends Effect {
    static get pattern() {
        return NO_MAXIMUM_HAND_SIZE;
    }

    get removesMaximum() {
        return true;
    }
}
