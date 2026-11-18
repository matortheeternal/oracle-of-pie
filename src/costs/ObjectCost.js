import CostItem from './CostItem.js';
import PhraseList from '../phrases/PhraseList.js';
import { NotImplementedError } from '../core/customErrors.js';

export default class ObjectCost extends CostItem {
    static get pattern() {
        throw new NotImplementedError('pattern');
    }

    static match(scribe, str) {
        return str.match(this.pattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.objects = this.consume([PhraseList]);
    }

    get children() {
        return [this.objects].filter(Boolean);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get removesSource() {
        return this.phrases.some(phrase => phrase.refersToSelf);
    }

    get isRecognized() {
        return Boolean(this.objects) && super.isRecognized;
    }
}
