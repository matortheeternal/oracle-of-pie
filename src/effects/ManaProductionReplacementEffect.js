import Effect from './Effect.js';

const FACTOR = { twice: 2, 'three times': 3 };
const PRODUCTION = new RegExp(
    '^(?<source>it|that (?:land|permanent)) produces?'
        + ' (?<factor>twice|three times) as much(?: of that)? mana'
        + ' instead\\b', 'i'
);
const COLOR = new RegExp(
    '^(?:that mana|it) becomes? (?<color>colorless|white|blue'
        + '|black|red|green) instead\\b', 'i'
);

const SET_PRODUCTION = new RegExp(
    '^(?:it|that land) produces? (?<mana>\\{[WUBRGC]\\})'
        + ' instead of any other type and amount\\b', 'i'
);

export default class ManaProductionReplacementEffect extends Effect {
    static match(scribe, str) {
        return str.match(PRODUCTION) ?? str.match(COLOR) ?? str.match(SET_PRODUCTION);
    }

    parseArguments(match) {
        this.multiplier = FACTOR[match.groups.factor?.toLowerCase()] ?? null;
        this.replacementMana = match.groups.mana ?? null;
        this.color = match.groups.color?.toLowerCase() ?? null;
    }
}
