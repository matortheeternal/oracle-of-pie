import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const CHANGE_TARGET = /^change the targets? of (?=[^,.]+)/i;
const SINGLE_TARGET = /^with a single target\b/i;

export default class ChangeTargetEffect extends Effect {
    static get pattern() {
        return CHANGE_TARGET;
    }

    parseArguments(match) {
        this.objects = this.consume([PhraseList]);
        this.requiresSingleTarget = Boolean(this.consumeText(SINGLE_TARGET));
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects);
    }
}
