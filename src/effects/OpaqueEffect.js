import Effect from './Effect.js';

const MODE_COUNT = '(?:one|two|three|one or more|one or both|any number|up to \\w+)';
const OPAQUE_ALTERNATIVES = [
    'prevent all (?:combat )?damage that would be dealt [^,.]+',
    'prevent the next [^,.]+',
    'take an extra turn after this one',
    'copy [^,.]+',
    `choose ${MODE_COUNT}(?: [^—,.]*)? ?—`,
    'choose (?:a|an|one|two) [^,.]+',
    'attach [^,.]+ to [^,.]+',
    'look at [^,.]+',
    'reveal [^,.]+',
    'exchange control of [^,.]+',
    'switch [^,.]+',
    'double [^,.]+',
    'untap all [^,.]+',
    'skip [^,.]+',
    'pay [^,.]+',
    'roll a d\\d+',
    'flip a coin',
    'play [^,.]+',
    'cast [^,.]+',
    'the next time [^,.]+',
    'attacks? each combat if able',
    'blocks? each combat if able',
    'enters? with [^,.]+',
    'enters? tapped(?: unless [^,.]+)?',
    'enters? prepared',
    'becomes? [^,.]+',
    'is [^,.]+',
    'are [^,.]+',
    'loses? all abilities[^,.]*',
    'chooses? [^,.]+',
    'may [^,.]+ any time[^,.]*',
    'you get [^,.]+',
    'reveals? (?:their|your) hand',
    'you may exert [^,.]+',
    'that ability triggers an additional time',
    'has no maximum hand size',
    'you have no maximum hand size',
    'you win the game',
    'you lose the game',
    'get [^,.]+ \\{E\\}[^,.]*'
];
const OPAQUE = new RegExp(
    `^(${OPAQUE_ALTERNATIVES.join('|')})`, 'i'
);

export default class OpaqueEffect extends Effect {
    static get pattern() {
        return OPAQUE;
    }

    parseArguments(match) {
        this.text = match[1];
    }

    get isOpaque() {
        return true;
    }
}
