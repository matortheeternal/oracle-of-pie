import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const MOVE = new RegExp(
    '^moves? (?=[^.]*?\\bcounters? (?:of each kind )?(?:not on ~ )?(?:from|among) )',
    'i'
);
const COUNTERS_FROM = new RegExp(
    '^(?<selection>[^.]*?\\bcounters?(?: of each kind)?)(?<excluded> not on ~)? '
        + '(?<origin>from among|from|among) ',
    'i'
);
const ONTO = /^\s*(?:onto|to) /i;

export default class MoveCountersEffect extends Effect {
    static get pattern() {
        return MOVE;
    }

    parseArguments(match) {
        const counters = this.consumeText(COUNTERS_FROM)?.groups;
        if (!counters) return;
        this.counterSelection = counters.selection;
        this.excludesKindsOnSource = Boolean(counters.excluded);
        this.mayUseSeveralSources = counters.origin.toLowerCase().includes('among');
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
