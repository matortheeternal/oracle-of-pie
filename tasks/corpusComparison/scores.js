import { isDeepStrictEqual } from 'node:util';
import TagScore from '../tags/TagScore.js';

function percent(value) {
    return `${(value * 100).toFixed(8)}%`;
}

function rates({ precision, recall }) {
    return `P ${percent(precision)}, R ${percent(recall)}`;
}

function scoreLine(row) {
    if (!row) return 'absent';
    return `${row.tp}/${row.fp}/${row.fn}, ${rates(row)}`;
}

function rateFell(oldTp, oldErrors, newTp, newErrors) {
    const oldTotal = BigInt(oldTp) + BigInt(oldErrors) || 1n;
    const newTotal = BigInt(newTp) + BigInt(newErrors) || 1n;
    return BigInt(newTp) * oldTotal < BigInt(oldTp) * newTotal;
}

function regressions(before, after) {
    if (!before) return [];
    const { tp, fp, fn } = after ?? { tp: 0, fp: 0, fn: 0 };
    const labels = [];
    if (rateFell(before.tp, before.fp, tp, fp)) labels.push('precision down');
    if (rateFell(before.tp, before.fn, tp, fn)) labels.push('recall down');
    if (fn > before.fn) labels.push('FN up');
    if (fp > before.fp) labels.push('FP up');
    if (tp < before.tp) labels.push('TP down');
    return labels;
}

export default function compareScores(before, after, report) {
    const previous = TagScore.fromJSON(before);
    const current = TagScore.fromJSON(after);
    const tags = [...new Set([...previous.tags, ...current.tags])].sort();
    const worse = [];
    const other = [];

    for (const tag of tags) {
        if (isDeepStrictEqual(before.counts[tag], after.counts[tag])) continue;
        const from = Object.hasOwn(before.counts, tag) ? previous.rowFor(tag) : null;
        const to = Object.hasOwn(after.counts, tag) ? current.rowFor(tag) : null;
        const labels = regressions(from, to);
        const line = `${tag}: ${scoreLine(from)} -> ${scoreLine(to)}`;
        if (labels.length) worse.push(`${line} [${labels.join(', ')}]`);
        if (!labels.length) other.push(line);
    }

    report.line(`Tag micro: ${rates(previous.micro)} -> ${rates(current.micro)}`);
    report.list('Tag regressions (TP/FP/FN)', worse);
    report.list('Other tag score changes (TP/FP/FN)', other);
}
