import ConditionalSentence from './ConditionalSentence.js';

const REFLEXIVE = /^(when you do)((?:, for each [^,]+)?), /i;

export default class ReflexiveTriggerSentence extends ConditionalSentence {
    static matchStatement(scribe, text) {
        return text.match(REFLEXIVE);
    }

    get dependsOnPrevious() {
        return Boolean(this.previous);
    }

    get antecedentEffects() {
        const effects = super.antecedentEffects;
        const optional = effects.filter(effect => effect.isOptional);
        return optional.length ? optional : effects;
    }
}
