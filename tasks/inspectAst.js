import fs from 'node:fs';
import { PATHS } from './shared/paths.js';
import AstService from './ast/AstService.js';

const USAGE = 'Usage: npm run ast -- "Card Name"';

function fail(lines) {
    console.error(lines.join('\n'));
    process.exit(1);
}

function notFoundLines(name, suggestions) {
    const lines = [`No card named "${name}" in ${PATHS.corpus}.`];
    if (!suggestions.length) return lines;
    const indented = suggestions.map(suggestion => `  ${suggestion}`);
    return [...lines, 'Did you mean:', ...indented];
}

const name = process.argv.slice(2).join(' ').trim();
if (!name) fail([USAGE]);
if (!fs.existsSync(PATHS.corpus)) fail([`No ${PATHS.corpus}; run npm run corpus.`]);

const service = new AstService();
const inspection = service.inspectName(name);
if (!inspection) fail(notFoundLines(name, service.search(name)));
console.log(JSON.stringify(inspection, null, 2));
