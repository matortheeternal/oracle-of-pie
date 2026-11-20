import Phrase from '../../phrases/Phrase.js';
import SelfReference from '../../phrases/SelfReference.js';
import AttachedReference from '../../phrases/AttachedReference.js';
import NounPhrase from '../../phrases/NounPhrase.js';

const LEAD_PARSERS = [SelfReference, AttachedReference];
const COMPANIONS = /^ ?and (?<minimum>at least )?(?=\w)/i;

function matchLead(scribe, str) {
    for (const parser of LEAD_PARSERS) {
        const match = parser.match(scribe, str);
        if (match) return { parser, match };
    }
    return null;
}

export default class CoordinatedSubject extends Phrase {
    static match(scribe, str) {
        const lead = matchLead(scribe, str);
        if (!lead) return null;
        const rest = str.slice(lead.match[0].length);
        const companions = rest.match(COMPANIONS);
        if (!companions) return null;
        if (!NounPhrase.match(scribe, rest.slice(companions[0].length))) return null;
        const isMinimum = Boolean(companions.groups.minimum);
        return Object.assign([''], { lead, isMinimum });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const { parser, match: lead } = match.lead;
        this.lead = parser.parse(scribe, lead, str);
        this.remainingStr = this.lead.remainingStr;
        this.consumeText(COMPANIONS);
        this.isMinimum = match.isMinimum;
        this.companions = this.consume([NounPhrase]);
        this.companions?.markConditionOnly();
    }

    get children() {
        return [this.lead, this.companions].filter(Boolean);
    }

    get isRecognized() {
        return Boolean(this.companions?.isRecognized) && this.lead.isRecognized;
    }

    get isAntecedentCandidate() {
        return false;
    }

    get refersToSelf() {
        return this.lead.refersToSelf;
    }

    get isAttached() {
        return this.lead.isAttached;
    }

    get controlledByYou() {
        return this.lead.controlledByYou;
    }

    hasType(type) {
        return this.lead.hasType(type);
    }
}
