import { readJsonl } from './files.js';
import { reviewPath } from './paths.js';
import TagHistory from './TagHistory.js';

const UNDECIDED = new Set(['pending', 'skip']);

export default class ReviewLog {
    static forQueue(name) {
        return new ReviewLog(readJsonl(reviewPath(name)));
    }

    static parseId(id) {
        const separator = id.lastIndexOf('|');
        return { cardId: id.slice(0, separator), tag: id.slice(separator + 1) };
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

    isPending(id) {
        return UNDECIDED.has(this.verdictFor(id));
    }

    get decided() {
        return [...this.verdicts].filter(([id]) => !this.isPending(id));
    }

    get historyByTag() {
        this.cachedHistory ??= this.buildHistory();
        return this.cachedHistory;
    }

    historyFor(tag) {
        return this.historyByTag.get(tag) ?? new TagHistory();
    }

    buildHistory() {
        const history = new Map();
        for (const [id, verdict] of this.decided) {
            const { tag } = ReviewLog.parseId(id);
            if (!history.has(tag)) history.set(tag, new TagHistory());
            history.get(tag).add(verdict);
        }
        return history;
    }
}
