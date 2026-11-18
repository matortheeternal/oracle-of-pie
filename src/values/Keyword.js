import Node from '../core/Node.js';

const PARAMETER_ALTERNATIVES = [
    '\\{[^}]+\\}(?:\\{[^}]+\\})*',
    '\\d+',
    'X',
    'from [a-z]+(?: and from [a-z]+)*',
    '[a-z]+ [A-Z][a-z]+',
    'N'
];
const PARAMETER = new RegExp(
    `^(?:—| )?(${PARAMETER_ALTERNATIVES.join('|')})?`
);

export default class Keyword extends Node {
    static match(scribe, str) {
        return str.match(scribe.keywordPattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.name = match[1].toLowerCase();
        const parameter = this.remainingStr.match(PARAMETER);
        this.parameter = parameter?.[1] ?? null;
        if (parameter?.[0])
            this.remainingStr = this.remainingStr.slice(parameter[0].length);
    }
}
