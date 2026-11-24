import Effect from './Effect.js';

const LOSE_ABILITIES = /^loses? all (?<other>other )?abilities\b/i;

export default class LoseAbilitiesEffect extends Effect {
    static get pattern() {
        return LOSE_ABILITIES;
    }

    parseArguments(match) {
        this.keepsSelf = Boolean(match.groups.other);
    }
}
