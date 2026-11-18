import Effect from './Effect.js';

const CHOICE_ALTERNATIVES = [
    'a creature type(?: other than [^,.]+)?', 'a color', 'two colors', 'a card name',
    'a nonland card name', 'a card type', 'a basic land type', 'a land type',
    'a planeswalker type', 'a number(?: between \\w+ and \\w+)?',
    'odd or even', 'left or right',
    'an opponent', 'a player'
];
const CHOOSE_VALUE = new RegExp(`^chooses? (${CHOICE_ALTERNATIVES.join('|')})`, 'i');
const ARTICLE = /^an? /;

export default class ChooseValueEffect extends Effect {
    static get pattern() {
        return CHOOSE_VALUE;
    }

    parseArguments(match) {
        this.choice = match[1].toLowerCase().replace(ARTICLE, '');
    }

    get choosesCreatureType() {
        return this.choice.startsWith('creature type');
    }

    get choosesColor() {
        return this.choice.endsWith('color') || this.choice.endsWith('colors');
    }
}
