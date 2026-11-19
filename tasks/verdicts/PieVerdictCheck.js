import ReviewLog from '../ReviewLog.js';
import PieVerdict from './PieVerdict.js';
import { judgementOfAll } from '../pie/pieJudgement.js';

export default class PieVerdictCheck {
    constructor({ cards, flags, baseline }) {
        this.cards = cards;
        this.flags = flags;
        this.baseline = baseline;
        this.flagsById = new Map();
    }

    flagsOf(cardId) {
        if (!this.flagsById.has(cardId))
            this.flagsById.set(cardId, this.flags.flagsFor(this.cards.get(cardId)));
        return this.flagsById.get(cardId);
    }

    judgementOf(cardId, inspection) {
        const flags = this.flagsOf(cardId).filter(flag => flag.inspection === inspection);
        return judgementOfAll(flags);
    }

    check(reviews) {
        const verdicts = [];
        for (const [id, verdict] of reviews.decided) {
            const { cardId, tag } = ReviewLog.parseId(id);
            if (!this.cards.has(cardId)) continue;
            const judgement = this.judgementOf(cardId, tag);
            const baseline = this.baseline[id];
            verdicts.push(new PieVerdict({ id, verdict, judgement, baseline }));
        }
        return verdicts;
    }
}
