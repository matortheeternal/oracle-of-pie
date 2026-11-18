import ObjectEffect from './ObjectEffect.js';
import PhraseList from '../phrases/PhraseList.js';

const ATTACH = /^attach /i;
const TO = /^to /i;

export default class AttachEffect extends ObjectEffect {
    static get pattern() {
        return ATTACH;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.recipients = this.consumeText(TO) ? this.consume([PhraseList]) : null;
    }

    get parts() {
        return [this.objects, this.recipients].filter(Boolean);
    }

    get isComplete() {
        return super.isComplete && Boolean(this.recipients);
    }

    get recipientPhrases() {
        return this.recipients?.phrases ?? [];
    }
}
