import ActionEvent from './ActionEvent.js';

const EXERTS = /^(?<subject>.+?) exerts?(?= (?:a|an|one or more)\b)/i;

export default class ExertsEvent extends ActionEvent {
    static get pattern() {
        return EXERTS;
    }
}
