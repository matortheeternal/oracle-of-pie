import TagRule from './TagRule.js';

export default class EffectTagRule extends TagRule {
    static test(effect, context) {
        const phrases = effect.phrases ?? [];
        return phrases.some(phrase => this.testPhrase(phrase, effect, context));
    }

    static testPhrase(phrase, effect, context) {
        return false;
    }
}
