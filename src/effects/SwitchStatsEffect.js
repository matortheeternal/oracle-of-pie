import ObjectEffect from './ObjectEffect.js';
import PhraseList from '../phrases/PhraseList.js';

const STATS_FIRST = /^(?:the )?power and toughness of /i;
const STATS_LAST = /^(?<owner>[^,.]+?)'s power and toughness\b/i;
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
        if (STATS_FIRST.test(tail)) return match;
        const stats = tail.match(STATS_LAST);
        if (!stats) return null;
        const { owner } = stats.groups;
        if (!PhraseList.match(scribe, owner)) return null;
        const objects = PhraseList.parse(scribe, [''], owner);
        if (!objects.isRecognized || objects.remainingStr) return null;
        return Object.assign([match[0] + stats[0]], { owner, objects });
    }

    parseArguments(match) {
        if (match.objects) {
            this.possessive = match.owner;
            this.objects = match.objects;
            return;
        }
        this.consumeText(STATS_FIRST);
        this.appliesToEach = Boolean(this.consumeText(EACH_OF));
        super.parseArguments();
    }
}
