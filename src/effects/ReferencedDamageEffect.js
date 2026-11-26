import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const DEALT = /^that damage is dealt\b/i;
const TO = /^to /i;

export default class ReferencedDamageEffect extends Effect {
    static get pattern() {
        return DEALT;
    }

    parseArguments() {
        this.changesRecipient = Boolean(this.consumeText(TO));
        this.recipients = this.changesRecipient ? this.consume([PhraseList]) : null;
    }

    get parts() {
        return [this.recipients].filter(Boolean);
    }

    get isComplete() {
        return !this.changesRecipient || Boolean(this.recipients);
    }
}
