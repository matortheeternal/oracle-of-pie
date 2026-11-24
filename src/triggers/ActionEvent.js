import TriggerEvent from './TriggerEvent.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const THIS_WAY = /\bthis way\b/i;

export default class ActionEvent extends TriggerEvent {
    static get objectParsers() {
        return PHRASE_PARSERS;
    }

    parseObjectPhrase() {
        return this.consume(this.constructor.objectParsers);
    }

    get isReflexive() {
        return THIS_WAY.test(this.raw);
    }

    get objectSource() {
        return null;
    }
}
