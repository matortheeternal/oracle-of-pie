import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const MULTIPLIER = { double: 2, triple: 3 };
const MULTIPLY = new RegExp(
    '^(?<verb>double|triple) (?:all )?damage(?: that)?'
        + ' (?<source>[^,.]+?) would deal\\b', 'i'
);

export default class DamageMultiplierEffect extends Effect {
    static get pattern() {
        return MULTIPLY;
    }

    parseArguments(match) {
        const { source, verb } = match.groups;
        this.source = this.parseNext(source, [PhraseList]);
        this.sourceText = source;
        this.multiplier = MULTIPLIER[verb.toLowerCase()];
    }

    get parts() {
        return this.source?.remainingStr ? [] : [this.source].filter(Boolean);
    }
}
