import Node, { trimLeadingSpace } from './Node.js';

export default class Parser extends Node {
    parseNext(str, parsers) {
        for (const parser of parsers) {
            const match = parser.match(this.scribe, str);
            if (match) return parser.parse(this.scribe, match, str);
        }
        return null;
    }

    consume(parsers) {
        const node = this.parseNext(this.remainingStr, parsers);
        if (!node) return null;
        this.remainingStr = node.remainingStr;
        return node;
    }

    consumeText(pattern) {
        const match = this.remainingStr.match(pattern);
        if (!match) return null;
        this.remainingStr = trimLeadingSpace(this.remainingStr.slice(match[0].length));
        return match;
    }

    consumeAll(parsers, nodes) {
        while (this.remainingStr.length) {
            const before = this.remainingStr;
            const node = this.consume(parsers);
            if (!node) break;
            node.apply(nodes);
            if (this.remainingStr === before) break;
        }
        return nodes;
    }
}
