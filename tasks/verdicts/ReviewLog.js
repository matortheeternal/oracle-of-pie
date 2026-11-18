import { readJsonl } from './files.js';
import { reviewPath } from './paths.js';

export default class ReviewLog {
    static forQueue(name) {
        return new ReviewLog(readJsonl(reviewPath(name)));
    }

    constructor(decisions) {
        const entries = decisions.map(decision => [decision.id, decision.verdict]);
        this.verdicts = new Map(entries);
    }

    verdictFor(id) {
        return this.verdicts.get(id) ?? 'pending';
    }

    isRejected(id) {
        return this.verdicts.get(id) === 'wrong';
    }
}
