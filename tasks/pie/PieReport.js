import { percent } from '../shared/table.js';
import { COLOR_POLICIES } from '../../src/index.js';

const COLOR_BREAK_TAG = 'color-break';

export default class PieReport {
    constructor() {
        this.policyTotals = {};
        this.policyFlagged = {};
        this.byInspection = {};
        this.colorBreaks = { total: 0, flagged: 0 };
        this.flags = [];
    }

    add(card, colors, flags) {
        const policy = COLOR_POLICIES.find(candidate => candidate.appliesTo(colors));
        this.countPolicy(policy?.id, flags.length > 0);
        this.countColorBreak(card, flags.length > 0);
        for (const flag of flags) this.addFlag(card, flag);
    }

    countPolicy(policy, flagged) {
        if (!policy) return;
        this.policyTotals[policy] = (this.policyTotals[policy] ?? 0) + 1;
        if (flagged) this.policyFlagged[policy] = (this.policyFlagged[policy] ?? 0) + 1;
    }

    countColorBreak(card, flagged) {
        if (!card.tags.includes(COLOR_BREAK_TAG)) return;
        this.colorBreaks.total++;
        if (flagged) this.colorBreaks.flagged++;
    }

    addFlag(card, flag) {
        const id = flag.inspection.id;
        this.byInspection[id] = (this.byInspection[id] ?? 0) + 1;
        this.flags.push({ name: card.name, uri: card.scryfall_uri, ...flag.toJSON() });
    }

    get summary() {
        return { totals: this.policyTotals, flagged: this.policyFlagged };
    }

    policyLine([policy, total]) {
        const flagged = this.policyFlagged[policy] ?? 0;
        const rate = percent(flagged / total);
        return `${policy.padEnd(10)} printed cards flagged ${flagged}/${total} = ${rate}`;
    }

    inspectionLines() {
        const counts = Object.entries(this.byInspection).sort((a, b) => b[1] - a[1]);
        return counts.map(([id, count]) => `  ${id.padEnd(22)} ${count}`);
    }

    lines() {
        const { flagged, total } = this.colorBreaks;
        return [
            ...Object.entries(this.policyTotals).map(entry => this.policyLine(entry)),
            `color-break tag caught ${flagged}/${total}`,
            ...this.inspectionLines()
        ];
    }
}
