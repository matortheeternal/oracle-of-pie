import { NotImplementedError } from '../../core/customErrors.js';

export default class EventConnector {
    static get pattern() {
        throw new NotImplementedError('pattern');
    }

    static read(scribe, previous) {
        const connector = previous.remainingStr.match(this.pattern);
        if (!connector) return null;
        const text = previous.remainingStr.slice(connector[0].length);
        return this.readEvent(scribe, previous, text);
    }

    static readEvent(scribe, previous, text) {
        throw new NotImplementedError('readEvent');
    }
}
