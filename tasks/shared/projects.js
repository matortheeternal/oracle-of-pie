import fs from 'node:fs';
import path from 'node:path';
import { readJson } from './files.js';
import { PATHS } from './paths.js';

const HOME_PREFIX = /^~/;
const EXAMPLE = 'projects.example.json';

function expandHome(dir) {
    return dir.replace(HOME_PREFIX, process.env.HOME);
}

function readProjectDirs() {
    if (!fs.existsSync(PATHS.projects)) {
        const name = path.basename(PATHS.projects);
        console.warn(`No reviews/${name}; copy ${EXAMPLE} to review custom cards.`);
        return {};
    }
    const entries = Object.entries(readJson(PATHS.projects));
    return Object.fromEntries(entries.map(([name, dir]) => [name, expandHome(dir)]));
}

let projectDirs = null;

export default function getProjectDirs() {
    projectDirs ??= readProjectDirs();
    return projectDirs;
}
