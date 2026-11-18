import Node from '../core/Node.js';

const REST_OF_CLAUSE = /^[\s\S]+/;

export default class UnrecognizedText extends Node {
    static fromLeftover(scribe, str) {
        return str ? UnrecognizedText.parse(scribe, [str], str) : null;
    }

    static match(scribe, str) {
        return str.match(REST_OF_CLAUSE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[0].trim();
    }

    get isRecognized() {
        return false;
    }
}
