import Effect from './Effect.js';
import { SUBTYPE_CHOICES } from '../phrases/modifiers/SubtypeSetModifier.js';

const FORMAT = 'a deck(?: with this commander)?|your starting deck';
const RULE = '(?<rule>can have|has no|contains only|contains at least'
    + '|shares a card type)';
const DECK_RULE = new RegExp(`^(?<deck>${FORMAT}) ${RULE} (?<requirement>[^.]+)`, 'i');
const COMPANION_RULES = [
    'shares a card type', 'has a different name', 'has an activated ability',
    'has mana value \\d+ or less',
    'has more than one of the same mana symbol in its mana cost',
    'has mana value (?:even|odd|\\d+ or greater)',
    `is an? ${SUBTYPE_CHOICES} card`
];
const COMPANION = new RegExp(
    '^(?<rule>each|no) (?<deck>[^,.]+ in your starting deck) (?<requirement>'
        + COMPANION_RULES.join('|') + ')$', 'i'
);
const COLOR_IDENTITY_ALLOWANCE = new RegExp(
    '^the color identity of (?<spellTypes>instant and sorcery) cards in your deck '
        + 'can include (?<extraColors>one) color of your choice not in your commander\'s '
        + 'color identity, and your deck can have any basic land cards\\b', 'i'
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
        return super.match(scribe, str) ?? str.match(COMPANION) ?? str.match(COMMANDER)
            ?? str.match(COLOR_IDENTITY_ALLOWANCE);
    }

    parseArguments(match) {
        const { extraColors, spellTypes } = match.groups;
        this.extraColorIdentity = extraColors ? 1 : null;
        this.extraColorSpellTypes = spellTypes?.toLowerCase() ?? null;
        this.allowsAnyBasicLands = Boolean(extraColors);
        this.deck = match.groups.deck?.toLowerCase() ?? 'your deck';
        this.rule = match.groups.rule?.toLowerCase() ?? null;
        this.requirement = match.groups.requirement ?? null;
    }
}
