import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe } from './corpus/corpusScribe.js';
import { pieCards } from './corpus/pieCorpus.js';
import CitationReview from './pie/CitationReview.js';
import PieReport from './pie/PieReport.js';
import { PieInspector } from '../src/index.js';

const disabled = process.argv.slice(2);
const corpus = readJson(PATHS.corpus);
const scribe = createCorpusScribe(corpus);
const inspector = new PieInspector({ profiles: readJson(PATHS.pieProfiles), disabled });
const report = new PieReport();
const citationReview = new CitationReview(inspector, disabled);

for (const { card, faces, colors } of pieCards(scribe, corpus)) {
    const flags = inspector.inspect(faces);
    report.add(card, colors, flags);
    citationReview.add(card, faces, flags);
}

writeJson(PATHS.pieFlags, report.flags);
writeJson(PATHS.pieSummary, report.summary);
writeJson(PATHS.pieCitationCandidates, citationReview.flags);
for (const line of report.lines()) console.log(line);
