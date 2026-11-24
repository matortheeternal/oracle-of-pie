import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../shared/paths.js';

const SOURCE_DIR = path.join(ROOT, 'src');
const SCRIPT_EXTENSION = '.js';

function sourceFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
    return entries
        .filter(entry => entry.isFile() && entry.name.endsWith(SCRIPT_EXTENSION))
        .map(entry => path.join(entry.parentPath, entry.name));
}

function className(file) {
    return path.basename(file, SCRIPT_EXTENSION);
}

function relative(file) {
    return path.relative(ROOT, file);
}

function readLowerCase(file) {
    return fs.readFileSync(file, 'utf8').toLowerCase();
}

export default class SourceIndex {
    constructor() {
        this.files = sourceFiles(SOURCE_DIR);
        this.texts = new Map();
        this.byClass = new Map(this.files.map(file => [className(file), file]));
    }

    fileFor(className) {
        const file = this.byClass.get(className);
        return file ? relative(file) : null;
    }

    filesMentioning(word, folder) {
        const needle = word.toLowerCase();
        const dir = path.join(SOURCE_DIR, folder);
        const inFolder = this.files.filter(file => file.startsWith(dir));
        const matches = inFolder.filter(file => this.read(file).includes(needle));
        return matches.map(relative);
    }

    read(file) {
        if (!this.texts.has(file)) this.texts.set(file, readLowerCase(file));
        return this.texts.get(file);
    }
}
