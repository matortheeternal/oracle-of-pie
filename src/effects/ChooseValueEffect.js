import Effect from './Effect.js';

const CARD_NAME_FILTER = 'nonbasic land|land|artifact|nonartifact, nonland|nonland';
const CARD_NAME = `(?:a|an|any) (?:(?:${CARD_NAME_FILTER}) )?card name`;
const CHOICE_ALTERNATIVES = [
    'a color shared among two exiled cards used to craft it',
    'a creature type that hasn\'t been noted for (?:this [a-z]+|~)',
    'any number of creature cards',
    'a(?: nonland)? card name(?: and a creature type| other than [^,.]+)?',
    'a creature type and a card name',
    'a card type other than (?:creature or land|creature|land)',
    'Abzan or Mardu',
    'another color', 'a third color',
    'fame or fortune', 'money, friends, or secrets', 'NCR or Legion',
    'land or nonland',
    'one at random',
    '\\d+(?:, \\d+)*,? or \\d+ at random',
    'an opponent who controls more lands than you',
    'an opponent with the (?:highest number|most life(?: among your'
        + ' opponents| or tied for most life)?)',
    'how each player votes this turn',
    'a creature type(?: other than [^,.]+)?', 'a color(?: other than [^,.]+)?',
    '(?:a|one) (?:result|die result)(?: at random)?',
    'two colors', CARD_NAME, 'a card type', 'a basic land type', 'a land type',
    'a planeswalker type', 'a number(?: between \\w+ and \\w+)?',
    'odd or even', 'left or right', 'friend or foe',
    'an opponent(?! or )', 'a player(?! or )'
];
const CHOOSE_VALUE = new RegExp(
    `^(?<secret>secretly )?chooses? (${CHOICE_ALTERNATIVES.join('|')})`, 'i'
);
const ARTICLE = /^(?:a|an|any) /;

export default class ChooseValueEffect extends Effect {
    static get pattern() {
        return CHOOSE_VALUE;
    }

    parseArguments(match) {
        this.choice = match[2].toLowerCase().replace(ARTICLE, '');
        this.isSecret = Boolean(match.groups.secret);
    }

    get choosesCreatureType() {
        return this.choice.startsWith('creature type');
    }

    get choosesColor() {
        return this.choice.endsWith('color') || this.choice.endsWith('colors');
    }
}
