import Modifier from './Modifier.js';
import Parser from '../../core/Parser.js';
import { MODIFIER_PARSERS } from './index.js';

const BRACKETS = /^\[([^\]]+)\]/;

export default class CleaveModifier extends Modifier {
    static match(scribe, str) {
        const match = str.match(BRACKETS);
        if (!match) return null;
        const modifier = new Parser(scribe).parseNext(match[1], MODIFIER_PARSERS);
        if (!modifier?.isRecognized || modifier.remainingStr) return null;
        return Object.assign(match, { modifier });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.modifier = match.modifier;
    }

    get children() {
        return [this.modifier];
    }
}
