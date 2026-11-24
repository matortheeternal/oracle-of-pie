import ObjectEffect from './ObjectEffect.js';
import { COPY_EXCEPTION } from '../values/copyException.js';

const ENTERS_AS_COPY = /^enters? (?:tapped )?as a copy of /i;

export default class EntersAsCopyEffect extends ObjectEffect {
    static get pattern() {
        return ENTERS_AS_COPY;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.exception = this.consumeText(COPY_EXCEPTION)?.[0] ?? null;
    }
}
