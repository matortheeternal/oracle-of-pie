import ActionEvent from './ActionEvent.js';
import ForMana from './qualifiers/ForMana.js';

const TAPS = /^(?<subject>.+?) taps?(?= (?:a|an|one or more)\b)/i;

export default class TapsEvent extends ActionEvent {
    static get pattern() {
        return TAPS;
    }

    static get qualifierParsers() {
        return [ForMana];
    }

    get isForMana() {
        return Boolean(this.qualifierOfKind(ForMana));
    }
}
