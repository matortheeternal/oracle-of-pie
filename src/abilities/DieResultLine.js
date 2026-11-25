import BodyAbility from './BodyAbility.js';

const RANGE = /^(?<low>\d+)(?:[—–-](?<high>\d+)|(?<below> or less))?/;
const RESULT = / (?:\||—) ([\s\S]+)$/;
const DIE_RESULT = new RegExp(RANGE.source + RESULT.source);

export default class DieResultLine extends BodyAbility {
    static match(scribe, str) {
        return str.match(DIE_RESULT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { low, high, below } = match.groups;
        this.low = below ? null : Number(low);
        this.high = Number(high ?? low);
    }
}
