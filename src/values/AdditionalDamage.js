import Parser from '../core/Parser.js';
import PhraseList from '../phrases/PhraseList.js';

const AND_DAMAGE = /^and ((?:twice )?(?:that much|\w+)) damage to (?:each of )?/i;

export default class AdditionalDamage extends Parser {
    static match(scribe, str) {
        return str.match(AND_DAMAGE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.amountText = match[1];
        this.targets = this.consume([PhraseList]);
    }

    get children() {
        return [this.targets].filter(Boolean);
    }

    get isRecognized() {
        return Boolean(this.targets) && super.isRecognized;
    }

    get phrases() {
        return this.targets?.phrases ?? [];
    }
}
