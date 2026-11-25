import ActionEvent from './ActionEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const COPY = /^(?<subject>.+?) (?:copy|copies) (?=(?:a|an|one or more) [^,]*spells?\b)/i;

export default class CopiesSpellEvent extends ActionEvent {
    static get pattern() {
        return COPY;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    get isRecognized() {
        return Boolean(this.objectPhrase?.hasType('spell')) && super.isRecognized;
    }
}
