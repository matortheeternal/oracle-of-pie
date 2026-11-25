import Effect from './Effect.js';
import BackReference from '../phrases/BackReference.js';

const CHANGE = /^change the text of /i;
const REPLACEMENT = /^by replacing all instances of one creature type with ([a-z-]+)\b/i;

export default class ReplaceCreatureTypeEffect extends Effect {
    static get pattern() {
        return CHANGE;
    }

    parseArguments() {
        this.object = this.consume([BackReference]);
        this.replacement = this.consumeText(REPLACEMENT)?.[1] ?? null;
    }

    get parts() {
        return [this.object].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.object && this.replacement);
    }
}
