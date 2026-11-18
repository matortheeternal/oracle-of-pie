import evaluateCard from './evaluators/evaluateCard.js';

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

    get tags() {
        this.cachedTags ??= evaluateCard(this);
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
}
