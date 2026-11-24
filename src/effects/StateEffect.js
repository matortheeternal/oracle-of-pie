import Effect from './Effect.js';

const STATE = /^(?:(?<enters>enters?)|becomes?|is|are) (?<state>prepared|goaded)\b/i;

export default class StateEffect extends Effect {
    static get pattern() {
        return STATE;
    }

    parseArguments(match) {
        this.state = match.groups.state.toLowerCase();
        this.entersInState = Boolean(match.groups.enters);
    }
}
