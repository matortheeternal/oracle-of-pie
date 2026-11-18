import BodyAbility from './BodyAbility.js';

const NUMERAL = '(?:I|II|III|IV|V|VI|VII|VIII|IX|X)';
const CHAPTER = new RegExp(`^(${NUMERAL}(?:, ${NUMERAL})*) (?:—|-) ([\\s\\S]+)$`);

export default class ChapterAbility extends BodyAbility {
    static match(scribe, str) {
        return str.match(CHAPTER);
    }

    continuesReferenceScope(previous) {
        return previous instanceof ChapterAbility;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.chapters = match[1].split(', ');
    }
}
