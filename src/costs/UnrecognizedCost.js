import CostItem from './CostItem.js';

const UNTIL_SEPARATOR = /^[^,]+/;

export default class UnrecognizedCost extends CostItem {
    static match(scribe, str) {
        return str.match(UNTIL_SEPARATOR);
    }

    get isRecognized() {
        return false;
    }

    get isUnrecognizedSpan() {
        return Boolean(this.raw);
    }
}
