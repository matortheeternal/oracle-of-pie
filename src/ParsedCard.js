import evaluateCard from './evaluators/evaluateCard.js';
import evidenceOf from './evaluators/evidenceOf.js';

function evidenceEntry([tag, { node, context }]) {
    return [tag, evidenceOf(node, context)];
}

export default class ParsedCard {
    constructor(card, text, tagLibrary, locator = null) {
        this.card = card;
        this.text = text;
        this.tagLibrary = tagLibrary;
        this.locator = locator;
    }

    locate(fragment) {
        return this.locator?.locate(fragment) ?? null;
    }

    walk() {
        return this.text.walk({ card: this.card, tagLibrary: this.tagLibrary });
    }

    get walked() {
        this.cachedWalk ??= [...this.walk()];
        return this.cachedWalk;
    }

    get lowercaseText() {
        this.cachedLowercaseText ??= this.text.raw.toLowerCase();
        return this.cachedLowercaseText;
    }

    mentions(phrase) {
        return this.lowercaseText.includes(phrase);
    }

    get tagMatches() {
        this.cachedTagMatches ??= evaluateCard(this);
        return this.cachedTagMatches;
    }

    get tags() {
        this.cachedTags ??= new Map([...this.tagMatches].map(evidenceEntry));
        return this.cachedTags;
    }

    get unrecognized() {
        const nodes = [...this.text.walk()].map(([node]) => node);
        return nodes.filter(node => node.isUnrecognizedSpan).map(node => node.raw);
    }

    get opaque() {
        const nodes = [...this.text.walk()].map(([node]) => node);
        return nodes.filter(node => node.isOpaque).map(node => node.raw);
    }

    get isFullyRecognized() {
        return this.text.isRecognized;
    }

    get isFullyModeled() {
        return this.isFullyRecognized && !this.opaque.length;
    }
}
