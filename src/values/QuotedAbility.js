import Node from '../core/Node.js';

const QUOTED = /^"([^"]*)"/;

function isTemporary(context) {
    return Boolean(context.effectDuration?.isTemporary || context.condition?.isDuration);
}

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
        const temporaryGrant = isTemporary(context) || null;
        return { ...context, granted: true, temporaryGrant };
    }
}
