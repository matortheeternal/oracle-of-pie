import tagCard from '../tagCard.js';
import ReviewLog from '../ReviewLog.js';

const REGRESSED = 'regressed';
const KNOWN = 'known';
const FIXED = 'fixed';

export default class VerdictCheck {
    constructor({ scribe, tree, cards, known }) {
        this.scribe = scribe;
        this.tree = tree;
        this.cards = cards;
        this.known = known;
        this.predictions = new Map();
    }

    predictedTags(cardId) {
        if (!this.predictions.has(cardId)) this.predictions.set(cardId, this.tag(cardId));
        return this.predictions.get(cardId);
    }

    tag(cardId) {
        const { tags } = tagCard(this.scribe, this.cards.get(cardId));
        return this.tree.withAncestors(Object.keys(tags));
    }

    check(queue, reviews) {
        const outcomes = [];
        for (const [id, verdict] of reviews.decided) {
            const { cardId, tag } = ReviewLog.parseId(id);
            if (!this.cards.has(cardId)) continue;
            const predicted = this.predictedTags(cardId).has(tag);
            const outcome = this.outcome(id, queue[verdict](predicted));
            outcomes.push({ id, verdict, outcome });
        }
        return outcomes;
    }

    outcome(id, result) {
        if (!this.known.has(id)) return result;
        return result === REGRESSED ? KNOWN : FIXED;
    }
}
