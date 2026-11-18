import Node from '../core/Node.js';

const QUOTED = /^"([^"]*)"/;

export default class QuotedAbility extends Node {
    static match(scribe, str) {
        return str.match(QUOTED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = scribe.parseText(match[1]);
    }

    get children() {
        return [this.text];
    }

    childContext(context) {
        return { ...context, granted: true };
    }
}
