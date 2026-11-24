import Effect from './Effect.js';

const REPEAT = new RegExp(
    '^repeat this process(?: (?<count>once|twice|\\w+ (?:more )?times))?'
    + '(?: for (?<variation>[^.]+))?', 'i'
);

export default class RepeatEffect extends Effect {
    static get pattern() {
        return REPEAT;
    }

    parseArguments(match) {
        this.count = match.groups.count?.toLowerCase() ?? null;
        this.variation = match.groups.variation ?? null;
    }

    get isOpenEnded() {
        return !this.count && !this.variation;
    }
}
