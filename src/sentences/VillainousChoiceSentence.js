import Sentence from './Sentence.js';
import PlayerPhrase from '../phrases/PlayerPhrase.js';
import EffectSentence from './EffectSentence.js';

const CHOICE = /^(?<chooser>.+?) faces? a villainous choice — /i;
const SETUP = /^(?<setup>.+?), then$/i;

export default class VillainousChoiceSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(CHOICE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const wording = match.statement.groups.chooser;
        const setup = wording.match(SETUP)?.groups.setup;
        this.setup = setup ? this.parseNext(setup, [EffectSentence]) : null;
        this.chooser = this.readChooser(wording);
        this.unreadChooser = this.setup ? null : this.chooser?.remainingStr ?? wording;
        this.readClauses(match.rest);
    }

    readChooser(text) {
        if (!this.setup) return this.parseNext(text, [PlayerPhrase]);
        const effect = this.setup.effects.at(-1);
        return effect?.actingSubject ?? effect?.ownerPhrase ?? null;
    }

    get children() {
        return [this.setup ?? this.chooser, ...super.children].filter(Boolean);
    }

    get effects() {
        return [...(this.setup?.effects ?? []), ...super.effects];
    }

    get isRecognized() {
        const resolvesChooser = Boolean(this.chooser?.isPlayer) && !this.unreadChooser;
        return resolvesChooser && super.isRecognized;
    }
}
