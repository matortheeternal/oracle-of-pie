import Effect from './Effect.js';

const DEFINED = '(power and toughness are each|power is|toughness is)';
const OWNER = '(?:(?:~|this creature)\'s|its)';
const DEFINE_PT = new RegExp(`^${OWNER} ${DEFINED} equal to `, 'i');
const AMOUNT = /^[^.]+/;
const TOUGHNESS = /\btoughness\b/i;
const POWER = /\bpower\b/i;

export default class DefinePTEffect extends Effect {
    static get pattern() {
        return DEFINE_PT;
    }

    parseArguments(match) {
        this.defined = match[1].toLowerCase();
        this.amount = this.consumeText(AMOUNT)?.[0] ?? '';
    }

    get definesPower() {
        return POWER.test(this.defined);
    }

    get definesToughness() {
        return TOUGHNESS.test(this.defined) || TOUGHNESS.test(this.amount);
    }
}
