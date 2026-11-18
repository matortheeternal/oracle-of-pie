import evaluateCard from './evaluators/evaluateCard.js';
import UnrecognizedText from './values/UnrecognizedText.js';
import UnrecognizedCost from './costs/UnrecognizedCost.js';
import Clause from './clauses/Clause.js';

const UNRECOGNIZED = [UnrecognizedText, UnrecognizedCost];

export default class ParsedCard {
    constructor(card, text, tagLibrary) {
        this.card = card;
        this.text = text;
        this.tagLibrary = tagLibrary;
    }

    walk() {
        return this.text.walk({ card: this.card, tagLibrary: this.tagLibrary });
    }

    get tags() {
        this.cachedTags ??= evaluateCard(this);
        return this.cachedTags;
    }

    get unrecognized() {
        const spans = [];
        for (const [node] of this.text.walk()) {
            if (UNRECOGNIZED.some(type => node instanceof type)) spans.push(node.raw);
            if (node instanceof Clause && !node.effect && node.raw) spans.push(node.raw);
        }
        return spans;
    }

    get opaque() {
        const nodes = [...this.text.walk()].map(([node]) => node);
        return nodes.filter(node => node.isOpaque).map(node => node.raw);
    }

    get isFullyRecognized() {
        return this.text.isRecognized;
    }
}
