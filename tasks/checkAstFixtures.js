import fs from 'node:fs';
import path from 'node:path';
import { Oracle } from '../src/index.js';
import { PATHS } from './shared/paths.js';
import AstFixture from './ast/fixtureCheck/AstFixture.js';
import * as report from './ast/fixtureCheck/fixtureReport.js';

const FIXTURE_FILE = /\.ya?ml$/;

const directory = PATHS.astFixtures;
const files = fs.readdirSync(directory).filter(file => FIXTURE_FILE.test(file)).sort();
const oracle = new Oracle();
const comparisons = [];
let errors = 0;

for (const file of files) {
    try {
        const fixture = AstFixture.load(path.join(directory, file));
        const comparison = fixture.check(oracle);
        comparisons.push(comparison);
        console.log(report.fixtureLines(fixture, comparison).join('\n'));
    } catch (error) {
        errors++;
        console.log(report.errorLines(file, error).join('\n'));
    }
}

console.log(report.summaryLine(comparisons, errors));
if (errors || comparisons.some(comparison => comparison.isFailing)) process.exitCode = 1;
