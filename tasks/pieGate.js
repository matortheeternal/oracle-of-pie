import { readJson, readJsonl } from '../src/files.js';
import { PATHS, queuePath } from '../src/paths.js';
import ReviewLog from '../src/ReviewLog.js';
import PieGate from '../src/pie/PieGate.js';
import { PIE_GATES } from '../src/pie/pieGates.js';

const summary = readJson(PATHS.pieSummary);
for (const gate of PIE_GATES) {
    const items = readJsonl(queuePath(gate.queue));
    console.log(new PieGate(gate, items, ReviewLog.forQueue(gate.queue), summary).line);
}
