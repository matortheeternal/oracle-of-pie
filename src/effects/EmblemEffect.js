import Effect from './Effect.js';
import QuotedAbility from '../values/QuotedAbility.js';

const EMBLEM = /^gets? an emblem with (?=["'])/i;

export default class EmblemEffect extends Effect {
    static get pattern() {
        return EMBLEM;
    }

    parseArguments() {
        this.ability = this.consume([QuotedAbility]);
    }

    get parts() {
        return [this.ability].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.ability);
    }
}
