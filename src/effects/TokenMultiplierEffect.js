import Effect from './Effect.js';

const MULTIPLIERS = { twice: 2, 'three times': 3 };
const TOKEN_MULTIPLIER = new RegExp(
    `^(?<multiplier>${Object.keys(MULTIPLIERS).join('|')}) that many of those tokens `
    + 'are created instead\\b', 'i'
);

export default class TokenMultiplierEffect extends Effect {
    static get pattern() {
        return TOKEN_MULTIPLIER;
    }

    parseArguments(match) {
        this.multiplier = MULTIPLIERS[match.groups.multiplier.toLowerCase()];
    }
}
