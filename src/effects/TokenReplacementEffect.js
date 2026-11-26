import Effect from './Effect.js';
import CreateTokenEffect from './CreateTokenEffect.js';

const REPLACEMENT = new RegExp(
    '^(?<tokens>those tokens plus (?:an additional )?[^.]+?|that'
        + ' many [^.]+? tokens?\\b[^.]*?) (?:are|is) created instead\\b', 'i'
);
const REASSIGN_CREATION = new RegExp(
    '^each token that would be created under (?<old>an opponent\'s) control '
        + '(?<window>this turn) is created under (?<new>your) control instead\\b', 'i'
);
const ADDITION = /^those tokens plus (?:an additional )?/i;

export default class TokenReplacementEffect extends Effect {
    static get pattern() {
        return REPLACEMENT;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(REASSIGN_CREATION);
    }

    parseArguments(match) {
        const { old, new: controller, window } = match.groups;
        this.reassignsCreation = Boolean(controller);
        this.previousController = old ?? null;
        this.controller = controller ?? null;
        this.window = window ?? null;
        if (this.reassignsCreation) return;
        const { tokens } = match.groups;
        this.addsToOriginal = ADDITION.test(tokens);
        this.tokenText = tokens.replace(ADDITION, '');
        this.creation = this.parseNext('create ' + this.tokenText, [CreateTokenEffect]);
    }

    get parts() {
        return [this.creation].filter(Boolean);
    }

    get isComplete() {
        return this.reassignsCreation
            || Boolean(this.creation?.isRecognized && !this.creation.remainingStr);
    }

    childContext(context) {
        return {
            ...super.childContext(context),
            definitionOnly: true
        };
    }
}
