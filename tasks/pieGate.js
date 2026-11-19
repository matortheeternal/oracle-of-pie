import { readJson, readJsonl } from './shared/files.js';
import { PATHS, queuePath } from './shared/paths.js';
import ReviewLog from './verdicts/ReviewLog.js';
import PieGate from './pie/PieGate.js';
import { PIE_GATES } from './pie/pieGates.js';

const summary = readJson(PATHS.pieSummary);
for (const gate of PIE_GATES) {
    const items = readJsonl(queuePath(gate.queue));
    console.log(new PieGate(gate, items, ReviewLog.forQueue(gate.queue), summary).line);
}
