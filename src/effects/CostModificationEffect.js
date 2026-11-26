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
const KEYWORD_PAYMENT = new RegExp(
    '^(?<keyword>blitz|unlock|exhaust|equip) costs you pay cost '
        + `(?<amount>${COST}) (?<direction>less)\\b`,
    'i'
);
const ACTION_PAYMENT = new RegExp(
    '^(?<keyword>plotting|foretelling) cards from (?<source>your hand) costs? '
        + `(?<amount>${COST}) (?<direction>less)\\b`,
    'i'
);
const PASSIVE_REDUCTION = new RegExp(
    `^this cost is (?<reduction>reduced) by (?<amount>${COST})`, 'i'
);
const COST_TAIL_ALTERNATIVES = [
    'for each card you own in exile and in your graveyard that\'s an instant card, '
        + 'a sorcery card, or a card that has an Adventure',
    'this way', 'for each (?:[^,.]|, (?=non))+', 'if [^,.]+', 'as long as [^,.]+',
    'during [^,.]+', 'unless they\'re mana abilities',
    ',? where X is [^.]+', 'and can be done on any player\'s turn'
];
const COST_TAIL = new RegExp(`^(?:${COST_TAIL_ALTERNATIVES.join('|')})`, 'i');
const LESS = 'less';
const CAST = 'cast';
const LOYALTY = /^\[[+−-]?\d+\]$/;

export default class CostModificationEffect extends Effect {
    static get pattern() {
        return COST_CHANGE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(KEYWORD_PAYMENT)
            ?? str.match(ACTION_PAYMENT) ?? str.match(PASSIVE_REDUCTION);
    }

    parseArguments(match) {
        const { amount, direction, extra, action } = match.groups;
        const { keyword, source, reduction } = match.groups;
        this.amount = amount ?? extra;
        this.direction = direction?.toLowerCase() ?? (reduction ? LESS : 'more');
        this.action = action?.toLowerCase() ?? null;
        this.keyword = keyword?.toLowerCase() ?? null;
        this.source = source?.toLowerCase() ?? null;
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

    get changesLoyaltyCost() {
        return LOYALTY.test(this.amount ?? '');
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
