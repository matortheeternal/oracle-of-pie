import ActionEvent from './ActionEvent.js';

const EXPLORES = /^(?<subject>.+?) explores?\b/i;

export default class ExploresEvent extends ActionEvent {
    static get pattern() {
        return EXPLORES;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}
