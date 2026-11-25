import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { normalizeCounterKind, lowersToughness } from './counterKinds.js';

const REMOVE_OBJECTS = /^(?:them(?: all)?|those counters)\b/i;
const REMOVE = /^removes? (?=[^.]*?\bcounters? from )/i;
const REMOVE_REFERENCED = /^removes? (?=(?:them|those counters)\b)/i;
const LOSE_COUNTERS = /^loses? (?=all counters\b)/i;
const LOST_COUNTERS = /^all counters\b/i;
const REMOVE_NUMBER = /^removes? (?=(?:one|two|three|all of them|\d+) (?:from|of|$))/i;
const REMAINING_COUNTERS = new RegExp(
    '^(?:all of them|(?:one|two|three|\\d+) of (?:them|those'
        + ' counters))\\b', 'i'
);
const IMPLIED_COUNT = /^(?:one|two|three|\d+)(?= from )/i;
const FROM = /^from /i;
const COUNTERS_FROM = /^(?<kind>[^.]*?)\s*\bcounters? from /i;
const PT_COUNTER = /[+\-−]\d+\/[+\-−]\d+/;

export default class RemoveCountersEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(REMOVE_REFERENCED)
            ?? str.match(REMOVE_NUMBER) ?? str.match(LOSE_COUNTERS);
    }

    parseArguments(match) {
        const reference = this.consumeText(REMOVE_OBJECTS)
            ?? this.consumeText(REMAINING_COUNTERS)
            ?? this.consumeText(IMPLIED_COUNT)
            ?? this.consumeText(LOST_COUNTERS);
        this.reference = reference?.[0] ?? null;
        if (reference) {
            this.objects = this.consumeText(FROM) ? this.consume([PhraseList]) : null;
            return;
        }
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
