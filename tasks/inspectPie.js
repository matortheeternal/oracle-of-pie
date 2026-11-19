import { readJson, writeJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe } from './corpus/corpusScribe.js';
import { pieCards } from './corpus/pieCorpus.js';
import PieReport from './pie/PieReport.js';
import { PieInspector } from '../src/index.js';

const disabled = process.argv.slice(2);
const corpus = readJson(PATHS.corpus);
const scribe = createCorpusScribe(corpus);
const inspector = new PieInspector({ profiles: readJson(PATHS.pieProfiles), disabled });
const report = new PieReport();

for (const { card, faces, colors } of pieCards(scribe, corpus))
    report.add(card, colors, inspector.inspect(faces));

writeJson(PATHS.pieFlags, report.flags);
writeJson(PATHS.pieSummary, report.summary);
for (const line of report.lines()) console.log(line);
