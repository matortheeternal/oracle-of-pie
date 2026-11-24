import Effect from './Effect.js';

const REDUCED_COLOR = '(?<colored>colored|white|blue|black|red|green)';
const LIMIT_ALTERNATIVES = [
    'can\'t reduce [^,.]+? to less than (?<floor>one mana|\\{\\d+\\})',
    'can\'t reduce [^,.]+? by more than (?<cap>[^,.]+)',
    `reduces only the amount of ${REDUCED_COLOR} mana you pay`
];
const COST_REDUCTION_LIMIT = new RegExp(
    `^this effect (?:${LIMIT_ALTERNATIVES.join('|')})`, 'i'
);

export default class CostReductionLimitEffect extends Effect {
    static get pattern() {
        return COST_REDUCTION_LIMIT;
    }

    parseArguments(match) {
        this.floor = match.groups.floor ?? null;
        this.cap = match.groups.cap ?? null;
        this.reducedColor = match.groups.colored?.toLowerCase() ?? null;
    }
}
