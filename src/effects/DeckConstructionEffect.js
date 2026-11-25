import Effect from './Effect.js';

const FORMAT = 'a deck(?: with this commander)?|your starting deck';
const RULE = '(?<rule>can have|contains only|contains at least|shares a card type)';
const DECK_RULE = new RegExp(`^(?<deck>${FORMAT}) ${RULE} (?<requirement>[^.]+)`, 'i');

export default class DeckConstructionEffect extends Effect {
    static get pattern() {
        return DECK_RULE;
    }

    parseArguments(match) {
        this.deck = match.groups.deck.toLowerCase();
        this.rule = match.groups.rule.toLowerCase();
        this.requirement = match.groups.requirement;
    }
}
