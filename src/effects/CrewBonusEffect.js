import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const CREW_BONUS = new RegExp(
    '^(?<saddles>saddles? mounts and )?crews? vehicles as though (?:its|their) power '
    + `were (?<bonus>${NUMBER_PATTERN}) greater\\b`, 'i'
);
const TRIPLE_POWER = new RegExp(
    '^(?<stations>stations? spacecraft and )?crews? vehicles '
        + 'as though (?:its|his|her|their) power were tripled\\b',
    'i'
);

export default class CrewBonusEffect extends Effect {
    static get pattern() {
        return CREW_BONUS;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(TRIPLE_POWER);
    }

    parseArguments(match) {
        this.bonus = match.groups.bonus ? numberValue(match.groups.bonus) : null;
        this.appliesToSaddle = Boolean(match.groups.saddles);
        this.appliesToStation = Boolean(match.groups.stations);
        this.multiplier = this.bonus === null ? 3 : 1;
    }
}
