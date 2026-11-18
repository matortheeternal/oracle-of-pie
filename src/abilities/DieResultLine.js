import BodyAbility from './BodyAbility.js';

const DIE_RESULT = /^(\d+)(?:[—–-](\d+))? \| ([\s\S]+)$/;

export default class DieResultLine extends BodyAbility {
    static match(scribe, str) {
        return str.match(DIE_RESULT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.low = Number(match[1]);
        this.high = Number(match[2] ?? match[1]);
    }
}
