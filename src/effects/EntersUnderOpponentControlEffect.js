import Effect from './Effect.js';

const CONTROL_RECIPIENT = 'the control of an opponent|an opponent\'s control';
const OPPONENT_CONTROL = new RegExp(`^enters? under (?:${CONTROL_RECIPIENT})\\b`, 'i');
const CHOSEN_OPPONENT = /^of your choice\b/i;

export default class EntersUnderOpponentControlEffect extends Effect {
    static get pattern() {
        return OPPONENT_CONTROL;
    }

    parseArguments() {
        this.consumeText(CHOSEN_OPPONENT);
    }
}
