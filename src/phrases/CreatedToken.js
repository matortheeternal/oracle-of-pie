import Phrase from './Phrase.js';

const TOKEN_REFERENCES = new Set(['it', 'itself', 'that token', 'the token']);

export default class CreatedToken extends Phrase {
    constructor(effect) {
        super(effect.scribe);
        this.raw = effect.description;
        this.controlledByCreator = effect.subjectIsYou;
        this.isCreatedToken = true;
    }

    get controlledByYou() {
        return this.controlledByCreator;
    }

    acceptsReference(reference) {
        return TOKEN_REFERENCES.has(reference);
    }

    hasType(type) {
        return type === 'token' || type === 'permanent';
    }
}
