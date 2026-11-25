import Effect from './Effect.js';

const FORMAT = 'a deck(?: with this commander)?|your starting deck';
const RULE = '(?<rule>can have|contains only|contains at least|shares a card type)';
const DECK_RULE = new RegExp(`^(?<deck>${FORMAT}) ${RULE} (?<requirement>[^.]+)`, 'i');
const COMPANION_RULES = [
    'shares a card type', 'has a different name', 'has an activated ability',
    'has mana value \\d+ or less',
    'has more than one of the same mana symbol in its mana cost',
    'has mana value (?:even|odd|\\d+ or greater)'
];
const COMPANION = new RegExp(
    '^(?<rule>each|no) (?<deck>[^,.]+ in your starting deck) (?<requirement>'
        + COMPANION_RULES.join('|') + ')$', 'i'
);
const COMMANDER = new RegExp(
    '^(?<deck>~|this [a-z]+) (?<rule>can be) (?<requirement>your'
        + ' commander)$', 'i'
);

export default class DeckConstructionEffect extends Effect {
    static get pattern() {
        return DECK_RULE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(COMPANION) ?? str.match(COMMANDER);
    }

    parseArguments(match) {
        this.deck = match.groups.deck.toLowerCase();
        this.rule = match.groups.rule.toLowerCase();
        this.requirement = match.groups.requirement;
    }
}
