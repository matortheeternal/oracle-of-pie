import ReviewLog from '../verdicts/ReviewLog.js';
import { cardKey } from '../corpus/corpusScribe.js';
import { SPIKE_INSPECTIONS } from './mtgishSemantics.js';

const QUEUES = ['printed-mono-pie-flags', 'printed-hybrid-pie-flags'];

function queueReviews(queue, predictions, reviews) {
    for (const [id, verdict] of ReviewLog.forQueue(queue).decided) {
        const { cardId, tag } = ReviewLog.parseId(id);
        if (!SPIKE_INSPECTIONS.includes(tag) || !predictions[cardId]) continue;
        const expected = verdict === 'correct';
        reviews.push({ id, tag, prediction: predictions[cardId], expected });
    }
}

function decidedReviews(predictions) {
    const reviews = [];
    for (const queue of QUEUES) queueReviews(queue, predictions, reviews);
    return reviews;
}

function score(result, review, baselineIds) {
    const flagged = review.prediction.flags.some(flag => flag.inspection === review.tag);
    result.compared++;
    if (!review.prediction.available) result.missing++;
    if (baselineIds.has(review.id) === review.expected) result.baselineAgrees++;
    if (flagged === review.expected) result.spikeAgrees++;
}

export default function pieReviews(corpus, baseline, predictions) {
    const byName = new Map(corpus.map(card => [card.name, cardKey(card)]));
    const baselineIds = new Set(baseline.map(flag =>
        `${byName.get(flag.name)}|${flag.inspection}`));
    const result = { compared: 0, baselineAgrees: 0, spikeAgrees: 0, missing: 0 };
    for (const review of decidedReviews(predictions)) score(result, review, baselineIds);
    return result;
}
