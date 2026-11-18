import Effect from './Effect.js';
import Expansion from '../definitions/Expansion.js';

const CREATE = /^creates? /i;
const TOKEN_DESCRIPTION_ALTERNATIVES = [
    ' with (?:"[^"]*"|[^,."])+(?:, and [^.,]+)?',
    ' named [^,.]+',
    ' that\'s a copy of [^,.]+',
    ' attached to [^,.]+',
    ' for each [^,.]+',
    ' tapped and attacking',
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
