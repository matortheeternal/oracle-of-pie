import fs from 'node:fs';
import { readJson, writeJson } from '../src/files.js';
import canonTierModule from '../src/canonTierModule.js';
import { PATHS } from '../src/paths.js';
import { createCorpusScribe } from '../src/corpusScribe.js';
import { pieCards } from '../src/pieCorpus.js';
import { PieInspector, ColorProfileBuilder } from '../../rules-scribe/src/index.js';

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
writeJson(PATHS.pieProfiles, profiles);
fs.writeFileSync(PATHS.canonTiers, canonTierModule(profiles));
for (const [id, { counts }] of Object.entries(profiles))
    console.log(id.padEnd(22), JSON.stringify(counts));
