import Phrase from './Phrase.js';
import PhraseList from './PhraseList.js';

const CONJUNCTION = /,? (?:and|or|and\/or) /i;
const GROUP_JOINER = /^(?:,? ?(?:and|or|and\/or) |, )/i;

class GroupMembers extends PhraseList {
    get joiner() {
        return GROUP_JOINER;
    }

    startsClause() {
        return false;
    }
}

export default class EffectSubjectGroup extends Phrase {
    static match(scribe, str) {
        return CONJUNCTION.test(str) ? GroupMembers.match(scribe, str) : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.members = this.consume([GroupMembers]);
        this.connectors = this.members.connectors;
    }

    get children() {
        return this.members.phrases;
    }

    get isGroup() {
        return this.children.length > 1 && this.connectors.at(-1) !== '';
    }

    get isAntecedentCandidate() {
        return false;
    }

    get isPlayer() {
        return this.members.every(phrase => phrase.isPlayer);
    }

    get includesYou() {
        return this.members.some(phrase => phrase.includesYou);
    }

    get canBeYou() {
        return this.members.some(phrase => phrase.canBeYou);
    }

    get controlledByYou() {
        return this.members.every(phrase => phrase.controlledByYou);
    }

    get isMass() {
        return this.members.every(phrase => phrase.isMass);
    }

    hasType(type) {
        return this.members.every(phrase => phrase.hasType(type));
    }
}
