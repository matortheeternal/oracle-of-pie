import BodyAbility from './BodyAbility.js';
import AbilityWordAbility from './AbilityWordAbility.js';

const RANGE = /^(?<low>\d+)(?:[—–-](?<high>\d+)|(?<below> or less))?/;
const RESULT = / (?:\||—) ([\s\S]+)$/;
const DIE_RESULT = new RegExp(RANGE.source + RESULT.source);

export default class DieResultLine extends BodyAbility {
    static match(scribe, str) {
        const match = str.match(DIE_RESULT);
        if (!match) return null;
        const result = match.at(-1);
        const label = AbilityWordAbility.match(scribe, result);
        if (!label) return match;
        const action = result.slice(label[0].length);
        return Object.assign(match, { action, label: label[1] });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { low, high, below } = match.groups;
        this.low = below ? null : Number(low);
        this.high = Number(high ?? low);
        this.label = match.label ?? null;
    }

    bodyText(match) {
        return match.action ?? super.bodyText(match);
    }
}
