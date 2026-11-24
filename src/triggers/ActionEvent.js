import TriggerEvent from './TriggerEvent.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const THIS_WAY = /\bthis way\b/i;

export default class ActionEvent extends TriggerEvent {
    static get objectParsers() {
        return PHRASE_PARSERS;
    }

    static match(scribe, str) {
        if (THIS_WAY.test(str)) return null;
        return super.match(scribe, str);
    }

    parseObjectPhrase() {
        return this.consume(this.constructor.objectParsers);
    }

    get objectSource() {
        return null;
    }
}
