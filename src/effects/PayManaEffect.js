import { ActivationCost } from 'mana-scribe';
import Effect from './Effect.js';

const PAY_MANA = /^pays? (any amount of |\w+ or more |\w+ (?=\{))?((?:\{[^}]+\})+)/i;
const PAY_EQUAL = /^pays? (an amount of )((?:\{[^}]+\})+)(?= equal to )/i;
const ADDITIONAL = /^pays? (an additional )((?:\{[^}]+\})+)/i;
const NEXT_COST = /^(,? ?(?:and\/or|or|and) |, )((?:\{[^}]+\})+)(?![\w{])/i;
const AS_CAST = /^(?:as you cast (?:this spell|it|them)|to cast this spell)\b/i;
const REPEATED = /^(?:any number of times|up to \w+ times)\b/i;
const EQUAL = /^equal to ([^,.]+)/i;
const ALTERNATIVE = /^rather than pay(?:ing)? [^,.]+/i;
const AND_LIFE = /^and (\w+) life\b/i;

export default class PayManaEffect extends Effect {
    static get pattern() {
        return PAY_MANA;
    }

    static match(scribe, str) {
        return str.match(ADDITIONAL) ?? super.match(scribe, str) ?? str.match(PAY_EQUAL);
    }

    parseArguments(match) {
        this.isAdditional = ADDITIONAL.test(match[0]);
        this.isVariableAmount = Boolean(match[1]) && !this.isAdditional;
        this.cost = ActivationCost.parse(match[2]);
        this.costOptions = this.readCostOptions();
        this.formula = this.consumeText(EQUAL)?.[1] ?? null;
        this.lifeAmountText = this.consumeText(AND_LIFE)?.[1] ?? null;
        this.isRepeatable = Boolean(this.consumeText(REPEATED));
        this.paidAsYouCast = Boolean(this.consumeText(AS_CAST));
        this.isAlternativeCost = Boolean(this.consumeText(ALTERNATIVE));
    }

    readCostOptions() {
        const options = [];
        let next = this.consumeText(NEXT_COST);
        while (next) {
            const cost = ActivationCost.parse(next[2]);
            options.push({ connector: next[1].trim(), cost });
            next = this.consumeText(NEXT_COST);
        }
        return options;
    }

    get manaValue() {
        return this.cost.symbols.reduce((sum, symbol) => sum + symbol.cmcValue(), 0);
    }

    get paysEnergy() {
        return this.cost.symbols.some(symbol => symbol.type === 'energy');
    }
}
