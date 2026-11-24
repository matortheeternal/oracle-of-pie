import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const CREW_BONUS = new RegExp(
    '^(?<saddles>saddles? mounts and )?crews? vehicles as though (?:its|their) power '
    + `were (?<bonus>${NUMBER_PATTERN}) greater\\b`, 'i'
);

export default class CrewBonusEffect extends Effect {
    static get pattern() {
        return CREW_BONUS;
    }

    parseArguments(match) {
        this.bonus = numberValue(match.groups.bonus);
        this.appliesToSaddle = Boolean(match.groups.saddles);
    }
}
