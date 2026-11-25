import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const CHANGE_TARGET = /^change the targets? of (?=[^,.]+)/i;
const SINGLE_TARGET = /^with a single target\b/i;
const RETARGET_TO = /^change the targets? to /i;

export default class ChangeTargetEffect extends Effect {
    static get pattern() {
        return CHANGE_TARGET;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(RETARGET_TO);
    }

    parseArguments(match) {
        this.objects = this.consume([PhraseList]);
        this.specifiesNewTarget = RETARGET_TO.test(match[0]);
        this.requiresSingleTarget = Boolean(this.consumeText(SINGLE_TARGET));
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects);
    }
}
