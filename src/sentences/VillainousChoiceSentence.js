import Sentence from './Sentence.js';
import PlayerPhrase from '../phrases/PlayerPhrase.js';

const CHOICE = /^(?<chooser>.+?) faces? a villainous choice — /i;

export default class VillainousChoiceSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(CHOICE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const chooser = match.statement.groups.chooser;
        this.chooser = this.parseNext(chooser, [PlayerPhrase]);
        this.unreadChooser = this.chooser?.remainingStr ?? chooser;
        this.readClauses(match.rest);
    }

    get children() {
        return [this.chooser, ...super.children].filter(Boolean);
    }

    get isRecognized() {
        return !this.unreadChooser && super.isRecognized;
    }
}
