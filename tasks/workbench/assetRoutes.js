import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { send } from './http.js';

const REVIEW_UI = path.dirname(fileURLToPath(import.meta.url));
const ASSET_TYPES = {
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8'
};
const ASSETS = ['astView.js', 'astView.css'];

function assetRoute(name) {
    const file = path.join(REVIEW_UI, name);
    const type = ASSET_TYPES[path.extname(name)];
    const pattern = new RegExp(`^/assets/${name.replace('.', '\\.')}$`);
    return [pattern, 'GET', (req, res) => send(res, 200, fs.readFileSync(file), type)];
}

export const ASSET_ROUTES = ASSETS.map(assetRoute);
