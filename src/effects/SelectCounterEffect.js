import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const CHOOSE_COUNTER = /^chooses? (?:a|one) counter on /i;
const GIVE_COUNTER = /^gives? /i;
const SAME_KIND = /^another counter of that kind\b/i;

export class ChooseCounterEffect extends Effect {
    static get pattern() {
        return CHOOSE_COUNTER;
    }

    parseArguments() {
        this.sources = this.consume([PhraseList]);
    }

    get parts() {
        return [this.sources].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.sources);
    }
}

export class GiveMatchingCounterEffect extends Effect {
    static get pattern() {
        return GIVE_COUNTER;
    }

    parseArguments() {
        this.recipients = this.consume([PhraseList]);
        this.matchesExistingKind = Boolean(this.consumeText(SAME_KIND));
    }

    get parts() {
        return [this.recipients].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.recipients && this.matchesExistingKind);
    }
}
