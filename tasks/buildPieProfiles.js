import fs from 'node:fs';
import { readJson, writeJson } from './shared/files.js';
import canonTierModule from './pie/canonTierModule.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe } from './corpus/corpusScribe.js';
import { pieCards } from './corpus/pieCorpus.js';
import { PieInspector, ColorProfileBuilder } from '../src/index.js';

const corpus = readJson(PATHS.corpus);
const scribe = createCorpusScribe(corpus);
const inspector = new PieInspector();
const builder = new ColorProfileBuilder(inspector.inspections);

for (const { card, faces, colors } of pieCards(scribe, corpus)) {
    builder.addCard(colors);
    for (const attribution of inspector.attributions(faces))
        builder.addAttribution(attribution, card.name);
}

const profiles = builder.build();
const canonIds = inspector.inspections
    .filter(inspection => inspection.usesCanonTiers)
    .map(inspection => inspection.id);
const canonProfiles = Object.fromEntries(canonIds.map(id => [id, profiles[id]]));
writeJson(PATHS.pieProfiles, profiles);
fs.writeFileSync(PATHS.canonTiers, canonTierModule(canonProfiles));
for (const [id, { counts }] of Object.entries(profiles))
    console.log(id.padEnd(22), JSON.stringify(counts));
