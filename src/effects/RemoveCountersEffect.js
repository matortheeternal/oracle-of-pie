import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { normalizeCounterKind, lowersToughness } from './counterKinds.js';

const REMOVE = /^removes? (?=[^.]*?\bcounters? from )/i;
const COUNTERS_FROM = /^(?<kind>[^.]*?)\s*\bcounters? from /i;
const PT_COUNTER = /[+\-−]\d+\/[+\-−]\d+/;

export default class RemoveCountersEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }

    parseArguments(match) {
        const kindText = this.consumeText(COUNTERS_FROM)?.groups.kind ?? '';
        this.kind = normalizeCounterKind(kindText.match(PT_COUNTER)?.[0]);
        this.objects = this.consume([PhraseList]);
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get isMinusCounters() {
        return lowersToughness(this.kind);
    }

    get isComplete() {
        return Boolean(this.objects);
    }
}
