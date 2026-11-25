import Effect from './Effect.js';
import { ActivationCost } from 'mana-scribe';

const COST = /^costs? (?<amount>(?:\{[^}]+\})+) to (?<action>foretell|plot)\b/i;

export default class FixedActionCostEffect extends Effect {
    static get pattern() {
        return COST;
    }

    parseArguments(match) {
        this.action = match.groups.action.toLowerCase();
        this.cost = ActivationCost.parse(match.groups.amount);
    }
}
