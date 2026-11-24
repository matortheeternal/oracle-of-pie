import Effect from './Effect.js';

const DISTINCT_TARGETS = /^each mode must target a different (?<target>[a-z]+)\b/i;

export default class DistinctModeTargetsEffect extends Effect {
    static get pattern() {
        return DISTINCT_TARGETS;
    }

    parseArguments(match) {
        this.targetKind = match.groups.target.toLowerCase();
    }
}
