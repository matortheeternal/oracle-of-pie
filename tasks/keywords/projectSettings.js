import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const PROJECT_FILE = /\.cmproj$/;

export default function projectSettings(projectDir) {
    const file = fs.readdirSync(projectDir).find(name => PROJECT_FILE.test(name));
    if (!file) return {};
    return YAML.parse(fs.readFileSync(path.join(projectDir, file), 'utf8')) ?? {};
}
