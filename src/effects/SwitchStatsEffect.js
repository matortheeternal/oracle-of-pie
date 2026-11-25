import ObjectEffect from './ObjectEffect.js';

const STATS_FIRST = /^(?:the )?power and toughness of /i;
const OBJECT = '(?<owner>~|it|this creature|that creature|target creature)';
const STATS_LAST = new RegExp(`^${OBJECT}'s power and toughness\\b`, 'i');
const EACH_OF = /^each of /i;
const SWITCH = /^switch(?:es)? /i;

export default class SwitchStatsEffect extends ObjectEffect {
    static get pattern() {
        return SWITCH;
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        if (!match) return null;
        const tail = str.slice(match[0].length);
        return STATS_FIRST.test(tail) || STATS_LAST.test(tail) ? match : null;
    }

    parseArguments() {
        if (!this.consumeText(STATS_FIRST)) {
            this.possessive = this.consumeText(STATS_LAST)?.groups.owner ?? null;
            return;
        }
        this.appliesToEach = Boolean(this.consumeText(EACH_OF));
        super.parseArguments();
    }

    get isComplete() {
        return Boolean(this.possessive) || super.isComplete;
    }
}
