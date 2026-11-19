import { PIE_VERDICT_OUTCOMES } from './pieVerdictOutcomes.js';

const KEEPS_FLAG = 'correct';

export default class PieVerdict {
    constructor({ id, verdict, judgement, baseline }) {
        this.id = id;
        this.verdict = verdict;
        this.judgement = judgement;
        this.baseline = baseline;
    }

    get hasBaseline() {
        return this.baseline !== undefined;
    }

    get hasChanged() {
        return this.hasBaseline && this.baseline !== this.judgement;
    }

    get keepsFlag() {
        return this.verdict === KEEPS_FLAG;
    }

    satisfiedBy(judgement) {
        return (judgement !== null) === this.keepsFlag;
    }

    get isSatisfied() {
        return this.satisfiedBy(this.judgement);
    }

    get wasSatisfied() {
        return this.satisfiedBy(this.baseline);
    }

    get isAcceptedDisagreement() {
        return !this.isSatisfied && this.hasBaseline && !this.hasChanged;
    }

    get outcome() {
        return PIE_VERDICT_OUTCOMES.find(outcome => outcome.applies(this)).name;
    }

    get change() {
        const now = this.judgement ?? 'no flag';
        if (!this.hasBaseline) return now;
        return `${this.baseline ?? 'no flag'} → ${now}`;
    }
}
