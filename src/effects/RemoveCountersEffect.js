import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { normalizeCounterKind, lowersToughness } from './counterKinds.js';

const REMOVE_OBJECTS = /^(?:them(?: all)?|those counters)\b/i;
const REMOVE = /^removes? (?=[^.]*?\bcounters? from )/i;
const REMOVE_REFERENCED = /^removes? (?=(?:them|those counters)\b)/i;
const COUNTERS_FROM = /^(?<kind>[^.]*?)\s*\bcounters? from /i;
const PT_COUNTER = /[+\-−]\d+\/[+\-−]\d+/;

export default class RemoveCountersEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(REMOVE_REFERENCED);
    }

    parseArguments(match) {
        this.reference = this.consumeText(REMOVE_OBJECTS)?.[0] ?? null;
        if (this.reference) return;
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
        return Boolean(this.objects || this.reference);
    }
}
