import { NotImplementedError } from './customErrors.js';

const LEADING_SPACE = /^[ \t]+/;

export function trimLeadingSpace(str) {
    return str.replace(LEADING_SPACE, '');
}

export default class Node {
    static match(scribe, str) {
        throw new NotImplementedError('match');
    }

    static parse(scribe, match, str) {
        const node = new this(scribe, match, str);
        node.claimSpan(str);
        return node;
    }

    claimSpan(str) {
        this.raw = str.slice(0, str.length - this.remainingStr.length).trim();
    }

    constructor(scribe, match = null, str = '') {
        Object.defineProperty(this, 'scribe', { value: scribe });
        this.raw = '';
        this.remainingStr = trimLeadingSpace(match ? str.slice(match[0].length) : str);
    }

    get children() {
        return [];
    }

    get expansions() {
        return [];
    }

    get isRecognized() {
        return this.children.every(child => child.isRecognized);
    }

    get isUnrecognizedSpan() {
        return false;
    }

    apply(nodes) {
        nodes.push(this);
    }

    *walk(context = {}) {
        yield [this, context];
        const childContext = this.childContext(context);
        for (const child of [...this.children, ...this.expansions])
            yield* child.walk(childContext);
    }

    childContext(context) {
        return context;
    }

    toJSON() {
        const fields = { ...this };
        delete fields.remainingStr;
        return { node: this.constructor.name, ...fields };
    }
}
