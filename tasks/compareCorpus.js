import fs from 'node:fs';
import path from 'node:path';
import { DATA } from './shared/paths.js';
import { loadBaseline, loadCorpus, loadCurrent } from './corpusComparison/snapshot.js';
import comparePredictions from './corpusComparison/predictions.js';
import compareScores from './corpusComparison/scores.js';
import comparePie from './corpusComparison/pie.js';

const SAMPLE_SIZE = 5;
const BASELINE_NAME = /^[a-z0-9][a-z0-9_-]*$/i;
const USAGE = 'Usage: npm run compare-corpus -- save <name|path>\n'
    + '       npm run compare-corpus -- compare <name|path> [--all]';

function baselinePath(name) {
    if (BASELINE_NAME.test(name)) return path.join(DATA, 'baselines', `${name}.json`);
    return path.resolve(name);
}

function save(file, corpus) {
    const snapshot = loadCurrent(corpus);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(snapshot), { flag: 'wx' });
    console.log(`Saved baseline for ${corpus.keys.length} cards to ${file}`);
}

function compare(file, corpus, all) {
    const baseline = loadBaseline(file, corpus);
    const current = loadCurrent(corpus);
    const report = {
        line: line => console.log(line),
        list(label, items) {
            console.log(`${label}: ${items.length}`);
            const shown = all ? items : items.slice(0, SAMPLE_SIZE);
            for (const item of shown) console.log(`  ${item}`);
            const hidden = items.length - shown.length;
            if (hidden) console.log(`  … ${hidden} more (--all to show)`);
        }
    };
    report.line(`Compared corpus outputs for ${corpus.keys.length} cards`);
    comparePredictions(baseline.predictions, current.predictions, corpus, report);
    compareScores(baseline.score, current.score, report);
    comparePie(baseline, current, corpus, report);
}

function run([action, name, option, ...rest]) {
    if (!name || name.startsWith('--') || rest.length) throw new Error(USAGE);
    if (action === 'save' && !option)
        return save(baselinePath(name), loadCorpus());
    if (action !== 'compare' || ![undefined, '--all'].includes(option))
        throw new Error(USAGE);
    const corpus = loadCorpus();
    compare(baselinePath(name), corpus, option === '--all');
}

try {
    run(process.argv.slice(2));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
