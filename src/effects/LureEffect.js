import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const LURE = /^all creatures able to block (?<target>[^,.]+?) do so\b/i;

export default class LureEffect extends Effect {
    static get pattern() {
        return LURE;
    }

    parseArguments(match) {
        this.lured = this.parseNext(match.groups.target, [PhraseList]);
    }

    get parts() {
        return [this.lured].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.lured?.isRecognized);
    }
}
