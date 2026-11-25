import Effect from './Effect.js';
import CreateTokenEffect from './CreateTokenEffect.js';

const REPLACEMENT = new RegExp(
    '^(?<tokens>those tokens plus (?:an additional )?[^.]+?|that'
        + ' many [^.]+? tokens?\\b[^.]*?) (?:are|is) created instead\\b', 'i'
);
const ADDITION = /^those tokens plus (?:an additional )?/i;

export default class TokenReplacementEffect extends Effect {
    static get pattern() {
        return REPLACEMENT;
    }

    parseArguments(match) {
        const { tokens } = match.groups;
        this.addsToOriginal = ADDITION.test(tokens);
        this.tokenText = tokens.replace(ADDITION, '');
        this.creation = this.parseNext('create ' + this.tokenText, [CreateTokenEffect]);
    }

    get parts() {
        return [this.creation].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.creation?.isRecognized && !this.creation.remainingStr);
    }

    childContext(context) {
        return {
            ...super.childContext(context),
            definitionOnly: true
        };
    }
}
