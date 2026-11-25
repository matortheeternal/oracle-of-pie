import { ActivationCost } from 'mana-scribe';
import Effect from './Effect.js';

const PAY_MANA = /^pays? (any amount of |\w+ or more |\w+ (?=\{))?((?:\{[^}]+\})+)/i;
const PAY_EQUAL = /^pays? (an amount of )((?:\{[^}]+\})+)(?= equal to )/i;
const REPEATED = /^(?:any number of times|up to \w+ times)\b/i;
const EQUAL = /^equal to ([^,.]+)/i;
const ALTERNATIVE = /^rather than pay(?:ing)? [^,.]+/i;
const AND_LIFE = /^and (\w+) life\b/i;

export default class PayManaEffect extends Effect {
    static get pattern() {
        return PAY_MANA;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PAY_EQUAL);
    }

    parseArguments(match) {
        this.isVariableAmount = Boolean(match[1]);
        this.cost = ActivationCost.parse(match[2]);
        this.formula = this.consumeText(EQUAL)?.[1] ?? null;
        this.lifeAmountText = this.consumeText(AND_LIFE)?.[1] ?? null;
        this.isRepeatable = Boolean(this.consumeText(REPEATED));
        this.isAlternativeCost = Boolean(this.consumeText(ALTERNATIVE));
    }

    get manaValue() {
        return this.cost.symbols.reduce((sum, symbol) => sum + symbol.cmcValue(), 0);
    }

    get paysEnergy() {
        return this.cost.symbols.some(symbol => symbol.type === 'energy');
    }
}
