import Effect from './Effect.js';

const CARD_NAME_FILTER = 'nonbasic land|land|artifact|nonartifact, nonland|nonland';
const CARD_NAME = `(?:a|an|any) (?:(?:${CARD_NAME_FILTER}) )?card name`;
const CHOICE_ALTERNATIVES = [
    'a creature type(?: other than [^,.]+)?', 'a color(?: other than [^,.]+)?',
    '(?:a|one) (?:result|die result)(?: at random)?',
    'two colors', CARD_NAME, 'a card type', 'a basic land type', 'a land type',
    'a planeswalker type', 'a number(?: between \\w+ and \\w+)?',
    'odd or even', 'left or right', 'friend or foe',
    'an opponent', 'a player'
];
const CHOOSE_VALUE = new RegExp(`^chooses? (${CHOICE_ALTERNATIVES.join('|')})`, 'i');
const ARTICLE = /^(?:a|an|any) /;

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
