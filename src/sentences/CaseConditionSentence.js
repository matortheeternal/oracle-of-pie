import Sentence from './Sentence.js';

const REQUIREMENTS = [
    'you control [^,.]+', 'you\'ve cast [^,.]+',
    'you\'ve gained [^,.]+ life this turn', '[^,.]+ attacked this turn',
    '[^,.]+(?:were put into graveyards(?: from anywhere)?|dealt damage) this turn',
    'there (?:are|is) [^,.]+'
];
const SOLVE = new RegExp(
    `^to solve — (?<condition>${REQUIREMENTS.join('|')})$`, 'i'
);

export default class CaseConditionSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(SOLVE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.condition = match.statement.groups.condition;
    }
}
