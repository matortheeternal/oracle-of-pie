import Effect from './Effect.js';

const STATES = ['prepared', 'goaded', 'plotted', 'monarch'];
const VERB = '(?:(?<enters>enters?)|becomes?|is|are)';
const STATE = new RegExp(`^${VERB} (?:the )?(?<state>${STATES.join('|')})\\b`, 'i');

export default class StateEffect extends Effect {
    static get pattern() {
        return STATE;
    }

    parseArguments(match) {
        this.state = match.groups.state.toLowerCase();
        this.entersInState = Boolean(match.groups.enters);
    }
}
