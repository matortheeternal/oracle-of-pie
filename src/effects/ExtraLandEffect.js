import Effect from './Effect.js';

const EXTRA_LAND = /^play (an|two) additional lands?(?: on each of your turns)?/i;

export default class ExtraLandEffect extends Effect {
    static get pattern() {
        return EXTRA_LAND;
    }

    parseArguments(match) {
        this.count = match[1].toLowerCase() === 'two' ? 2 : 1;
    }
}
