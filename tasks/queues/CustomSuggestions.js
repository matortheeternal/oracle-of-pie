import tagCard from '../tagCard.js';
import customQueueItem from './customQueueItem.js';

const SCRYFALL_TAG_SHARE = 0.8;

export default class CustomSuggestions {
    constructor({ scribes, tree, reviews, agreement }) {
        this.scribes = scribes;
        this.tree = tree;
        this.reviews = reviews;
        this.agreement = agreement;
        this.items = [];
        this.stats = {};
    }

    count(card, label, amount = 1) {
        const key = `${card.project} ${label}`;
        this.stats[key] = (this.stats[key] ?? 0) + amount;
    }

    usesScryfallTags(card) {
        const tags = card.userTags.map(tag => this.tree.resolve(tag));
        if (!tags.length) return false;
        const known = tags.filter(tag => this.tree.has(tag)).length;
        return known / tags.length >= SCRYFALL_TAG_SHARE;
    }

    mostSpecific(card, found) {
        const accepted = Object.keys(found)
            .filter(tag => !this.reviews.isRejected(`${card.id}|${tag}`));
        const impliedByChild = this.tree.withAncestors([]);
        for (const tag of accepted)
            this.tree.ancestors(tag).forEach(ancestor => impliedByChild.add(ancestor));
        return Object.entries(found).filter(([tag]) => !impliedByChild.has(tag));
    }

    addCard(card) {
        if (!card.isPlayable) return;
        const result = tagCard(this.scribes.forCard(card), card);
        this.count(card, 'cards');
        this.count(card, 'fully recognized', Number(result.recognized));
        this.count(card, 'suggestions', Object.keys(result.tags).length);
        const existing = this.existingTags(card);
        if (this.usesScryfallTags(card))
            this.agreement.add(card.id, this.predictedTags(result), existing);
        for (const [tag, matched] of this.mostSpecific(card, result.tags))
            this.suggest(card, tag, matched, result, existing);
    }

    predictedTags(result) {
        return this.tree.withAncestors(Object.keys(result.tags));
    }

    existingTags(card) {
        return this.tree.withAncestors(card.userTags.map(tag => this.tree.resolve(tag)));
    }

    suggest(card, tag, matched, result, existing) {
        if (existing.has(tag)) return;
        const found = new Set(Object.keys(result.tags));
        const implies = new Set([...this.tree.ancestors(tag)]
            .filter(ancestor => found.has(ancestor) && !existing.has(ancestor)));
        const { tree } = this;
        const { unrecognized } = result;
        const suggestion = { card, tag, matched, implies, tree, unrecognized };
        this.items.push(customQueueItem(suggestion));
    }
}
