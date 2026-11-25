import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const HEAL = /^(?<amount>all|the remaining) damage (?:already )?dealt to /i;
const HEALED = /^is healed\b/i;

export default class HealDamageEffect extends Effect {
    static get pattern() {
        return HEAL;
    }

    parseArguments(match) {
        this.healedDamage = match.groups.amount.toLowerCase();
        this.targets = this.consume([PhraseList]);
        this.isHealing = Boolean(this.consumeText(HEALED));
    }

    get parts() {
        return [this.targets].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.isHealing && this.targets);
    }
}
