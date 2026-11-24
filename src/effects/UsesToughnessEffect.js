import Effect from './Effect.js';

const USAGE_ALTERNATIVES = [
    '(?<damage>assigns? (?:combat )?damage) equal to',
    '(?<cost>(?:crews|saddles|stations)[^,.]*?) using'
];
const USES_TOUGHNESS = new RegExp(
    `^(?:${USAGE_ALTERNATIVES.join('|')}) (?:its|their) toughness `
    + 'rather than (?:its|their) power', 'i'
);

export default class UsesToughnessEffect extends Effect {
    static get pattern() {
        return USES_TOUGHNESS;
    }

    parseArguments(match) {
        this.assignsDamage = Boolean(match.groups.damage);
        this.costAction = match.groups.cost?.toLowerCase() ?? null;
    }
}
