import Modifier from './Modifier.js';

const WITH_OR_WITHOUT = /^(with|without|that has) /i;
const KEYWORD_JOINER = /^,? ?(?:and\/or|or|and) /i;
const KEYWORD_SEPARATOR = /,? ?(?:and\/or|or|and) /i;

function joinedKeyword(scribe, str) {
    const joiner = str.match(KEYWORD_JOINER);
    const keyword = joiner && scribe.keywordPattern.exec(str.slice(joiner[0].length));
    return keyword ? joiner[0] + keyword[0] : null;
}

function keywordList(scribe, str) {
    const first = scribe.keywordPattern.exec(str);
    if (!first) return null;
    let list = first[0];
    let next = joinedKeyword(scribe, str.slice(list.length));
    while (next) {
        list += next;
        next = joinedKeyword(scribe, str.slice(list.length));
    }
    return list;
}

export default class KeywordModifier extends Modifier {
    static match(scribe, str) {
        const lead = str.match(WITH_OR_WITHOUT);
        const list = lead && keywordList(scribe, str.slice(lead[0].length));
        return list ? [lead[0] + list, lead[1], list] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.negated = match[1].toLowerCase() === 'without';
        this.names = match[2].toLowerCase().split(KEYWORD_SEPARATOR);
    }

    get keywords() {
        return this.negated ? [] : this.names;
    }
}
