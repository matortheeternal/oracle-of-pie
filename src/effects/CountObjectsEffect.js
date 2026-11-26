import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const COUNT = new RegExp(
    '^(?:counts?|notes?) (?<property>the (?:number of|colors?'
        + ' of|mana value of)|your life total)\\b', 'i'
);
const COUNTERS_ON = /^(?<kind>[+-]\d+\/[+-]\d+|[a-z-]+) counters on /i;
const EXILE_TIMING = /^as it's put into exile\b/i;
const LIFE_TOTAL = 'your life total';

export default class CountObjectsEffect extends Effect {
    static get pattern() {
        return COUNT;
    }

    parseArguments(match) {
        this.property = match.groups.property.toLowerCase();
        this.counterKind = this.consumeText(COUNTERS_ON)?.groups.kind ?? null;
        this.objects = this.property === LIFE_TOTAL ? null : this.consume([PhraseList]);
        this.asExiled = Boolean(this.consumeText(EXILE_TIMING));
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return this.property === LIFE_TOTAL || Boolean(this.objects);
    }
}
