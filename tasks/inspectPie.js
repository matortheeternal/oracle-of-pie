import { readJson, writeJson } from '../src/files.js';
import { PATHS } from '../src/paths.js';
import { createCorpusScribe } from '../src/corpusScribe.js';
import { pieCards } from '../src/pieCorpus.js';
import PieReport from '../src/PieReport.js';
import { PieInspector } from 'oracle-of-pie';

const disabled = process.argv.slice(2);
const corpus = readJson(PATHS.corpus);
const scribe = createCorpusScribe(corpus);
const inspector = new PieInspector({ profiles: readJson(PATHS.pieProfiles), disabled });
const report = new PieReport();

for (const { card, faces, colors } of pieCards(scribe, corpus))
    report.add(card, colors, inspector.inspect(faces));

writeJson(PATHS.pieFlags, report.flags);
for (const line of report.lines()) console.log(line);
