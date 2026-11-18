import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const REMOVE = /^removes? (?=[^.]*?\bcounters? from )/i;
const COUNTERS_FROM = /^[^.]*?\bcounters? from /i;

export default class RemoveCountersEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }

    parseArguments(match) {
        this.consumeText(COUNTERS_FROM);
        this.objects = this.consume([PhraseList]);
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get isComplete() {
        return Boolean(this.objects);
    }
}
