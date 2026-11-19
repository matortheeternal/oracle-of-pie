import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe } from './corpus/corpusScribe.js';
import { parseCardFaces } from './corpus/pieCorpus.js';
import collectGaps from './gaps/collectGaps.js';
import GapReport from './gaps/GapReport.js';
import { percent } from './shared/table.js';

const DEFAULT_LIMIT = 25;
const SHAPE_WIDTH = 70;
const limit = Number(process.argv[2] ?? DEFAULT_LIMIT);
const corpus = readJson(PATHS.corpus);
const scribe = createCorpusScribe(corpus);
const report = new GapReport();

for (const card of corpus) {
    const faces = parseCardFaces(scribe, card);
    const gaps = faces.flatMap(face => collectGaps(face.parsed.text));
    report.addCard(card.name, gaps, faces.every(face => face.parsed.isFullyRecognized));
}
writeJson(PATHS.gapReport, report);

function count(value) {
    return String(value).padStart(4);
}

function topContext(stats) {
    const [[context, total]] = stats.topContexts(1);
    return total < stats.cards.size ? `${context} (+others)` : context;
}

function unlockLine(stats) {
    const shape = stats.shape.slice(0, SHAPE_WIDTH).padEnd(SHAPE_WIDTH);
    const counts = `${count(stats.unlocks)} unlock ${count(stats.cards.size)} cards`;
    return `${counts}  ${shape}  ${topContext(stats)}`;
}

function familyLine(stats) {
    return `${count(stats.cards.size)} cards  ${stats.shape}  e.g. ${stats.examples[0]}`;
}

function opaqueLine(stats) {
    return `${count(stats.cards.size)} cards  ${stats.shape}`;
}

function printSection(title, rows, describe) {
    console.log(`\n## ${title}`);
    for (const stats of rows.slice(0, limit)) console.log(describe(stats));
}

const share = percent(report.recognized / report.cards);
const withGaps = report.cards - report.recognized;
const recognized = `${report.recognized}/${report.cards} fully recognized (${share})`;
console.log(`${recognized}; ${withGaps} with gaps`);
const UNLOCKS_TITLE = 'Unrecognized shapes by cards unlocked (only gap on the card)';
const FAMILIES_TITLE = 'Gap families (context | first words) by cards';
const OPAQUE_TITLE = 'Opaque effects (recognized, not modeled) by cards';
printSection(UNLOCKS_TITLE, report.byUnlocks, unlockLine);
printSection(FAMILIES_TITLE, report.byFamily, familyLine);
printSection(OPAQUE_TITLE, report.byOpaque, opaqueLine);
