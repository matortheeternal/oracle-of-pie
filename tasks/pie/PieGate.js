import ReviewLog from '../verdicts/ReviewLog.js';
import { percent } from '../shared/table.js';

const WRONG = 'wrong';

export default class PieGate {
    constructor({ policy, target }, items, log, summary) {
        this.policy = policy;
        this.target = target;
        this.log = log;
        this.total = summary.totals[policy] ?? 0;
        this.flagged = summary.flagged[policy] ?? 0;
        this.itemsByCard = Map.groupBy(items, item => ReviewLog.parseId(item.id).cardId);
    }

    isReviewed(items) {
        return items.every(item => !this.log.isPending(item.id));
    }

    isWrong(items) {
        return items.some(item => this.log.verdictFor(item.id) === WRONG);
    }

    get reviewedCards() {
        return [...this.itemsByCard.values()].filter(items => this.isReviewed(items));
    }

    get wrongCards() {
        return this.reviewedCards.filter(items => this.isWrong(items)).length;
    }

    get flagRate() {
        return this.total ? this.flagged / this.total : 0;
    }

    get estimatedWrongRate() {
        const reviewed = this.reviewedCards.length;
        return reviewed ? (this.wrongCards / reviewed) * this.flagRate : null;
    }

    get verdict() {
        const rate = this.estimatedWrongRate;
        if (rate === null) return 'not reviewed';
        return rate <= this.target ? 'PASS' : 'FAIL';
    }

    get sampleText() {
        const reviewed = this.reviewedCards.length;
        const sampled = this.itemsByCard.size;
        const wrong = `${this.wrongCards}/${reviewed} reviewed cards wrong`;
        return `${wrong} (of ${sampled} sampled)`;
    }

    get estimateText() {
        const rate = this.estimatedWrongRate;
        const estimate = rate === null ? '-' : percent(rate);
        return `wrong-flag rate ${estimate} vs target ${percent(this.target)}`;
    }

    get line() {
        const flagged = `flagged ${percent(this.flagRate)}`;
        const details = `${this.sampleText}, ${this.estimateText}`;
        return `${this.policy.padEnd(10)} ${flagged}, ${details}: ${this.verdict}`;
    }
}
