import Effect from './Effect.js';

const DAY_NIGHT = /^becomes? (?<phase>day|night)(?: as (?<timing>[^,.]+ enters))?\b/i;

export default class DayNightEffect extends Effect {
    static get pattern() {
        return DAY_NIGHT;
    }

    parseArguments(match) {
        this.phase = match.groups.phase.toLowerCase();
        this.timing = match.groups.timing?.toLowerCase() ?? null;
    }
}
