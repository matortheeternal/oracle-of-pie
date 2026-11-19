import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import getProjectDirs from '../shared/projects.js';
import CustomCard from './CustomCard.js';

const CARD_FILE = /\.yml$/;

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

export default function loadProjects() {
    const dirs = Object.values(getProjectDirs());
    return dirs.flatMap(loadProject);
}
