import { ActivationCost } from 'mana-scribe';
import Effect from './Effect.js';

const PAY_MANA = /^pays? (any amount of |\w+ or more )?((?:\{[^}]+\})+)/i;
const REPEATED = /^any number of times\b/i;
const ALTERNATIVE = /^rather than pay(?:ing)? [^,.]+/i;
const AND_LIFE = /^and (\w+) life\b/i;

export default class PayManaEffect extends Effect {
    static get pattern() {
        return PAY_MANA;
    }

    parseArguments(match) {
        this.isVariableAmount = Boolean(match[1]);
        this.cost = ActivationCost.parse(match[2]);
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
