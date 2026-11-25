import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const ATTACK_LIMIT = new RegExp(
    '^no more than (?<limit>' + NUMBER_PATTERN + ') creatures? can attack ', 'i'
);
const WINDOW = /^(?:each combat|during that combat phase)\b/i;

export default class AttackLimitEffect extends Effect {
    static get pattern() {
        return ATTACK_LIMIT;
    }

    parseArguments(match) {
        this.maximumAttackers = numberValue(match.groups.limit);
        this.defenders = this.consume([PhraseList]);
        this.window = this.consumeText(WINDOW)?.[0] ?? null;
    }

    get parts() {
        return [this.defenders].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.defenders && this.window);
    }
}
