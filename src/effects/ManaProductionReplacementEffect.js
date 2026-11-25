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

export default class ManaProductionReplacementEffect extends Effect {
    static match(scribe, str) {
        return str.match(PRODUCTION) ?? str.match(COLOR);
    }

    parseArguments(match) {
        this.multiplier = FACTOR[match.groups.factor?.toLowerCase()] ?? null;
        this.color = match.groups.color?.toLowerCase() ?? null;
    }
}
