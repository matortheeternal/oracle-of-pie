import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import FixtureComparison from './FixtureComparison.js';
import { expectationFor } from './expectations/index.js';

const REQUIRED_FIELDS = ['name', 'text', 'expect'];
const ROOT_PATH = 'face';

export default class AstFixture {
    static load(file) {
        const data = YAML.parse(fs.readFileSync(file, 'utf8'));
        return new AstFixture(path.basename(file, path.extname(file)), data);
    }

    constructor(id, data) {
        const missing = REQUIRED_FIELDS.filter(field => data?.[field] === undefined);
        if (missing.length) throw new Error(`${id} is missing ${missing.join(', ')}`);
        this.id = id;
        this.name = data.name;
        this.typeLine = data.typeLine ?? '';
        this.text = data.text;
        this.expect = data.expect;
    }

    check(oracle) {
        const face = { name: this.name, typeLine: this.typeLine, text: this.text };
        const parsed = oracle.parseFace(face);
        const comparison = new FixtureComparison();
        expectationFor(this.expect).compare(parsed.text, comparison, ROOT_PATH);
        return comparison;
    }
}
