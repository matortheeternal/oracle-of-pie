import Parser from '../../core/Parser.js';
import { PHRASE_PARSERS } from '../../phrases/index.js';

const WITH = /^with /i;

function readGroup(scribe, str) {
    const parser = new Parser(scribe, null, '');
    return parser.parseNext(str.slice(str.match(WITH)[0].length), PHRASE_PARSERS);
}

export default class AttackingWith extends Parser {
    static match(scribe, str) {
        if (!WITH.test(str)) return null;
        const group = readGroup(scribe, str);
        if (!group?.isRecognized) return null;
        const text = str.slice(0, str.length - group.remainingStr.length);
        return Object.assign([text], { group });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.group = match.group;
    }

    get children() {
        return [this.group];
    }
}
