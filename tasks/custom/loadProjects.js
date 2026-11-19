import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { readJson } from '../shared/files.js';
import CustomCard from './CustomCard.js';

const HOME_PREFIX = /^~/;
const CARD_FILE = /\.yml$/;

function expandHome(dir) {
    return dir.replace(HOME_PREFIX, process.env.HOME);
}

function loadCard(projectDir, file) {
    const text = fs.readFileSync(path.join(projectDir, 'cards', file), 'utf8');
    const data = YAML.parse(text) ?? {};
    const stem = file.replace(CARD_FILE, '');
    return new CustomCard({ project: path.basename(projectDir), projectDir, stem, data });
}

function loadProject(projectDir) {
    const entries = fs.readdirSync(path.join(projectDir, 'cards'));
    const files = entries.filter(file => CARD_FILE.test(file));
    const cards = files.sort().map(file => loadCard(projectDir, file));
    return cards.filter(card => card.rawFaces.length > 0);
}

export default function loadProjects(projectsFile) {
    const dirs = Object.values(readJson(projectsFile)).map(expandHome);
    return dirs.flatMap(loadProject);
}
