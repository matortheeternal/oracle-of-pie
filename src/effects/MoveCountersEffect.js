import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const MOVE = /^moves? (?=[^.]*?\bcounters? from )/i;
const COUNTERS_FROM = /^[^.]*?\bcounters? from /i;
const ONTO = /^\s*(?:onto|to) /i;

export default class MoveCountersEffect extends Effect {
    static get pattern() {
        return MOVE;
    }

    parseArguments(match) {
        if (!this.consumeText(COUNTERS_FROM)) return;
        this.source = this.consume([PhraseList]);
        if (!this.consumeText(ONTO)) return;
        this.destination = this.consume([PhraseList]);
    }

    get parts() {
        return [this.source, this.destination].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.source && this.destination);
    }
}
