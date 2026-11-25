import ObjectEffect from './ObjectEffect.js';
import PhraseList from '../phrases/PhraseList.js';

const UNATTACH = /^unattaches? |^unattach /i;
const FROM = /^from /i;

export default class UnattachEffect extends ObjectEffect {
    static get pattern() {
        return UNATTACH;
    }

    parseArguments() {
        super.parseArguments();
        this.host = this.consumeText(FROM) ? this.consume([PhraseList]) : null;
    }

    get parts() {
        return [...super.parts, this.host].filter(Boolean);
    }
}
