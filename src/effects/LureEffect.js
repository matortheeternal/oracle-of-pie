import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const LURE = new RegExp(
    '^all creatures(?<opposing> your opponents control)? able to block '
        + '(?<target>[^,.]+?)(?<thisTurn> this turn)? do so\\b', 'i'
);

export default class LureEffect extends Effect {
    static get pattern() {
        return LURE;
    }

    parseArguments(match) {
        this.onlyOpposingCreatures = Boolean(match.groups.opposing);
        this.thisTurn = Boolean(match.groups.thisTurn);
        this.lured = this.parseNext(match.groups.target, [PhraseList]);
    }

    get parts() {
        return [this.lured].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.lured?.isRecognized);
    }
}
