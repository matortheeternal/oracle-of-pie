import ActionCost from './ActionCost.js';
import TapEffect from '../effects/TapEffect.js';

export default class TapObjectsCost extends ActionCost {
    static get actionParsers() {
        return [TapEffect];
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        return match?.action.raw.includes(',') ? match : null;
    }

    get includesTap() {
        return this.action.phrases.some(phrase => phrase.refersToSelf);
    }
}
