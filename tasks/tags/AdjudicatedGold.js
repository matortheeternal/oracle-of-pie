import ReviewLog from '../verdicts/ReviewLog.js';
import { policyById } from './policies/index.js';

export const SUGGESTED_QUEUE = 'scryfall-suggested-not-tagged';
export const TAGGED_QUEUE = 'scryfall-tagged-not-suggested';

function tagsByCard(log, verdict) {
    const byCard = new Map();
    for (const [id, each] of log.decided) {
        if (each !== verdict) continue;
        const { cardId, tag } = ReviewLog.parseId(id);
        if (!byCard.has(cardId)) byCard.set(cardId, []);
        byCard.get(cardId).push(tag);
    }
    return byCard;
}

function policyTags(explained, expectsPrediction) {
    const entries = Object.entries(explained);
    const agrees = ([, id]) => policyById(id).expectsPrediction() === expectsPrediction;
    return entries.filter(agrees).map(([tag]) => tag);
}

export default class AdjudicatedGold {
    static load(tree) {
        const confirmed = tagsByCard(ReviewLog.forQueue(SUGGESTED_QUEUE), 'correct');
        const rejected = tagsByCard(ReviewLog.forQueue(TAGGED_QUEUE), 'wrong');
        return new AdjudicatedGold(tree, confirmed, rejected);
    }

    constructor(tree, confirmedByCard, rejectedByCard) {
        this.tree = tree;
        this.confirmedByCard = confirmedByCard;
        this.rejectedByCard = rejectedByCard;
    }

    addedTags(key, explained) {
        return [...policyTags(explained, true), ...this.confirmedByCard.get(key) ?? []];
    }

    removedTags(key, explained) {
        return [...policyTags(explained, false), ...this.rejectedByCard.get(key) ?? []];
    }

    tagsFor(card, key, explained = {}) {
        const added = this.addedTags(key, explained);
        const gold = this.tree.withAncestors([...card.tags, ...added]);
        for (const tag of this.removedTags(key, explained)) gold.delete(tag);
        return gold;
    }
}
