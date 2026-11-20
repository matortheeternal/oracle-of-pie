import ActionEvent from './ActionEvent.js';

export default class ConsumingEvent extends ActionEvent {
    get consumesSelf() {
        return Boolean(this.objectPhrase?.refersToSelf);
    }

    get isRepeatable() {
        return !this.consumesSelf;
    }
}
