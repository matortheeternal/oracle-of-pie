import Effect from './Effect.js';
import Expansion from '../definitions/Expansion.js';
import QuotedAbility from '../values/QuotedAbility.js';

const CREATE = /^creates? /i;
const CREATURE_TOKEN = /\bcreature tokens?\b/i;
const LAND_TOKEN = /\bland tokens?\b/i;
const QUOTED_TEXT = /"[^"]*"/g;
const TOKEN_DESCRIPTION_ALTERNATIVES = [
    ' with (?:"[^"]*"|[^,."])+(?:, and [^.,]+)?',
    ' named (?:"[^"]*"|[^,."])+',
    ' that\'s a copy of [^,.]+',
    ' attached to [^,.]+',
    ' for each [^,.]+',
    ' equal to [^,.]+',
    ' tapped and attacking',
    ' that\'s tapped and attacking',
    ',? except (?:[^."]|"[^"]*")+',
    ' that (?:are|is) [^,.]+'
];
const TOKEN_NOUN = '((?:[^."]|"[^"]*")*?\\btokens?\\b)';
const TOKEN_DETAILS = `((?:${TOKEN_DESCRIPTION_ALTERNATIVES.join('|')})*)`;
const TOKEN_DESCRIPTION = new RegExp(`^${TOKEN_NOUN}${TOKEN_DETAILS}`, 'i');

export default class CreateTokenEffect extends Effect {
    static get pattern() {
        return CREATE;
    }

    parseArguments(match) {
        const description = this.consumeText(TOKEN_DESCRIPTION);
        this.description = description?.[0] ?? null;
    }

    get isComplete() {
        return Boolean(this.description);
    }

    get parts() {
        this.cachedQuoted ??= this.parseQuotedAbilities();
        return this.cachedQuoted;
    }

    parseQuotedAbilities() {
        const quotes = (this.description ?? '').match(QUOTED_TEXT) ?? [];
        return quotes.map(quote => this.parseQuoted(quote));
    }

    parseQuoted(quote) {
        const match = QuotedAbility.match(this.scribe, quote);
        return new QuotedAbility(this.scribe, match, quote);
    }

    get createsCreature() {
        return CREATURE_TOKEN.test(this.description ?? '');
    }

    get createsLand() {
        return LAND_TOKEN.test(this.description ?? '');
    }

    get tokenDefinitions() {
        const tokens = this.scribe.definitions.tokens;
        return tokens.definitionsNamedIn(this.description ?? '');
    }

    get expansions() {
        this.cachedExpansions ??= this.tokenDefinitions
            .map(definition => Expansion.of(this.scribe, definition, this));
        return this.cachedExpansions;
    }
}
