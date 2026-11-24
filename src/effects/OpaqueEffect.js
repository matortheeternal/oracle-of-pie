import Effect from './Effect.js';

const MODE_COUNT = '(?:one|two|three|one or more|one or both|any number|up to \\w+)';
export const OPAQUE_ALTERNATIVES = [
    'prevent all (?:combat )?damage that would be dealt [^,.]+',
    'prevent the next [^,.]+',
    'copy [^,.]+',
    `choose ${MODE_COUNT}(?: [^—,.]*)? ?—`,
    'choose (?:a|an|one|two) [^,.]+',
    'attach [^,.]+ to [^,.]+',
    'look at [^,.]+',
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
    'becomes? [^,.]+',
    'is [^,.]+',
    'are [^,.]+',
    'chooses? [^,.]+',
    'may [^,.]+ any time[^,.]*',
    'you get (?![^,.]*(?:\\{E\\}|counters?\\b))[^,.]+',
    'reveals? (?:their|your) hand',
    'that ability triggers an additional time',
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
