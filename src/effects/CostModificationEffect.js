import Effect from './Effect.js';
import {
    usesCreatureCount, usesOpposingArtifactCount
} from '../values/quantityDependencies.js';

const COST = '(?:\\{[^}]+\\})+';
const ADDITIONAL_COST = '(?<extra>(?:\\[[^\\]]+\\]|\\d+ life|(?:\\{[^}]+\\})+))';
const COST_CHANGE = new RegExp(
    '^costs? (?:(?<amount>' + COST + ') (?<direction>less|more) to '
        + '|an additional ' + ADDITIONAL_COST + ' to )(?<action>cast|activate)\\b', 'i'
);
const COST_TAIL_ALTERNATIVES = [
    'this way', 'for each (?:[^,.]|, (?=non))+', 'if [^,.]+', 'as long as [^,.]+',
    'during [^,.]+', 'unless they\'re mana abilities',
    ',? where X is [^.]+'
];
const COST_TAIL = new RegExp(`^(?:${COST_TAIL_ALTERNATIVES.join('|')})`, 'i');
const LESS = 'less';
const CAST = 'cast';

export default class CostModificationEffect extends Effect {
    static get pattern() {
        return COST_CHANGE;
    }

    parseArguments(match) {
        const { amount, direction, extra, action } = match.groups;
        this.amount = amount ?? extra;
        this.direction = direction?.toLowerCase() ?? 'more';
        this.action = action.toLowerCase();
        this.conditions = [];
        while (this.consumeCondition()) continue;
    }

    consumeCondition() {
        const condition = this.consumeText(COST_TAIL);
        if (condition) this.conditions.push(condition[0]);
        return Boolean(condition);
    }

    get reducesCost() {
        return this.direction === LESS;
    }

    get modifiesSpellCost() {
        return this.action === CAST;
    }

    get isConditional() {
        return this.conditions.length > 0;
    }

    get usesOpposingArtifactCount() {
        return this.conditions.some(usesOpposingArtifactCount);
    }

    get usesCreatureCount() {
        return this.conditions.some(usesCreatureCount);
    }

    get increasesCostPerExtraTarget() {
        return this.modifiesSpellCost && !this.reducesCost && this.conditions.some(
            condition => condition.toLowerCase() === 'for each target beyond the first'
        );
    }
}
