import Effect from './Effect.js';

const PROPERTIES = [
    'whether that card\'s mana value is greater than the number of artifacts you control',
    'whether the top card of your library is the chosen kind',
    'that card\'s name',
    'which number you chose'
];
const GUESS = new RegExp(`^guess(?:es)? (?<property>${PROPERTIES.join('|')})\\b`, 'i');

export default class GuessEffect extends Effect {
    static get pattern() {
        return GUESS;
    }

    parseArguments(match) {
        this.property = match.groups.property.toLowerCase();
    }

    get isPlayerAction() {
        return true;
    }
}
