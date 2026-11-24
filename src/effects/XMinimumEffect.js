import Effect from './Effect.js';

const X_MINIMUM = /^X can't be (?<floor>\d+)\b/;

export default class XMinimumEffect extends Effect {
    static get pattern() {
        return X_MINIMUM;
    }

    parseArguments(match) {
        this.minimumX = Number(match.groups.floor) + 1;
    }
}
