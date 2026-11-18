import ObjectEffect from './ObjectEffect.js';

const ENTERS_AS_COPY = /^enters? (?:tapped )?as a copy of /i;
const EXCEPTION = /^,? except (?:[^."]|"[^"]*")+/i;

export default class EntersAsCopyEffect extends ObjectEffect {
    static get pattern() {
        return ENTERS_AS_COPY;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.exception = this.consumeText(EXCEPTION)?.[0] ?? null;
    }
}
