import ObjectEffect from './ObjectEffect.js';

const MELD = /^melds? /i;
const RESULT = /^into (?<face>[^.]+)$/i;

export default class MeldEffect extends ObjectEffect {
    static get pattern() {
        return MELD;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.resultFace = this.consumeText(RESULT)?.groups.face ?? null;
    }

    get isComplete() {
        return Boolean(this.resultFace && super.isComplete);
    }
}
