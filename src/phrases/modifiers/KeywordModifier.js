import Modifier from './Modifier.js';

const WITH_OR_WITHOUT = /^(with|without) /i;

function keywordAfter(scribe, str, lead) {
    return scribe.keywordPattern.exec(str.slice(lead[0].length));
}

export default class KeywordModifier extends Modifier {
    static match(scribe, str) {
        const lead = str.match(WITH_OR_WITHOUT);
        const keyword = lead && keywordAfter(scribe, str, lead);
        return keyword ? [lead[0] + keyword[0], lead[1], keyword[0]] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.negated = match[1].toLowerCase() === 'without';
        this.name = match[2].toLowerCase();
    }

    get keyword() {
        return this.negated ? null : this.name;
    }
}
