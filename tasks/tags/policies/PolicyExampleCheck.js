import tagCard from '../../corpus/tagCard.js';

export default class PolicyExampleCheck {
    constructor({ scribe, tree, cardsByName }) {
        this.scribe = scribe;
        this.tree = tree;
        this.cardsByName = cardsByName;
    }

    check(policy) {
        return policy.examples.map(example => this.checkExample(policy, example));
    }

    checkExample(policy, { card: name, tag }) {
        const card = this.cardsByName.get(name);
        if (!card) return { name, tag, outcome: 'missing' };
        const gold = this.tree.withAncestors(card.tags);
        const result = tagCard(this.scribe, card, gold);
        const outcome = this.outcomeFor(policy, result, gold.has(tag), tag);
        return { name, tag, outcome };
    }

    outcomeFor(policy, result, scryfallHasTag, tag) {
        const predicted = Object.hasOwn(result.tags, tag);
        if (predicted !== policy.expectsPrediction()) return 'broken';
        if (predicted === scryfallHasTag) return 'held';
        return result.explained[tag] === policy.id ? 'held' : 'unexplained';
    }
}

export function cardsByName(corpus) {
    return new Map(corpus.map(card => [card.name, card]));
}
