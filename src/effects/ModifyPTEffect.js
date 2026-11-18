import Effect from './Effect.js';
import PTModifier from '../values/PTModifier.js';
import KeywordList from '../values/KeywordList.js';

const GETS = /^gets? (?=[+\-−]?(?:\d+|X|\*)\/)/i;
const AND_GAINS = /^and (?:gains?|has|have) /i;
const SCALING = /^(for each [^,.]+|where X is [^,.]+|as long as [^,.]+)/i;

export default class ModifyPTEffect extends Effect {
    static get pattern() {
        return GETS;
    }

    parseArguments(match) {
        this.modifier = this.consume([PTModifier]);
        this.keywords = this.consumeText(AND_GAINS) ? this.consume([KeywordList]) : null;
        this.scaling = this.consumeText(SCALING)?.[1] ?? null;
    }

    get parts() {
        return [this.modifier, this.keywords].filter(Boolean);
    }
}
