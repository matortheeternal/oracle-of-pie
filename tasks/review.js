import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUEUES = path.join(ROOT, 'queues');
const REVIEWS = path.join(ROOT, 'reviews');
const PAGE = path.join(ROOT, 'review', 'index.html');
const PROJECTS_FILE = path.join(ROOT, 'review', 'projects.json');
const PORT = Number(process.env.PORT ?? 5178);
const QUEUE_NAME = /^[\w-]+$/;
const JSONL_EXTENSION = /\.jsonl$/;
const HOME_PREFIX = /^~/;
const IMAGE_ROUTE = /^\/files\/([^/]+)\/([^/]+)$/;
const PAGE_ROUTE = /^\/$/;
const QUEUES_ROUTE = /^\/api\/queues$/;
const QUEUE_ROUTE = /^\/api\/queues\/([^/]+)$/;
const DECISIONS_ROUTE = /^\/api\/queues\/([^/]+)\/decisions$/;
const VERDICTS = new Set(['correct', 'wrong', 'skip']);
const HTML = 'text/html; charset=utf-8';
const IMAGE_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
};

function imageDirectory(projectDir) {
    const expanded = projectDir.replace(HOME_PREFIX, process.env.HOME);
    return path.join(expanded, 'dist', 'images');
}

function readProjects() {
    const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
    return Object.fromEntries(
        Object.entries(projects).map(([name, dir]) => [name, imageDirectory(dir)])
    );
}

const PROJECTS = readProjects();

fs.mkdirSync(REVIEWS, { recursive: true });

function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
    return lines.map(line => JSON.parse(line));
}

function latestDecisions(name) {
    const decisions = {};
    for (const decision of readJsonl(path.join(REVIEWS, `${name}.jsonl`)))
        decisions[decision.id] = decision;
    return decisions;
}

function countDecided(name) {
    const decisions = Object.values(latestDecisions(name));
    return decisions.filter(decision => decision.verdict !== 'skip').length;
}

function describeQueue(file) {
    const name = file.replace(JSONL_EXTENSION, '');
    const total = readJsonl(path.join(QUEUES, file)).length;
    return { name, total, decided: countDecided(name) };
}

function listQueues() {
    return fs.readdirSync(QUEUES)
        .filter(file => file.endsWith('.jsonl'))
        .map(describeQueue);
}

function send(res, status, body, type = 'application/json') {
    res.writeHead(status, { 'Content-Type': type });
    res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

function sendError(res, status, error) {
    send(res, status, { error });
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data || '{}')));
        req.on('error', reject);
    });
}

async function recordDecision(req, res, name) {
    const { id, verdict, note } = await readBody(req);
    if (!id || !VERDICTS.has(verdict))
        return sendError(res, 400, 'id and a valid verdict are required');
    const at = new Date().toISOString();
    const decision = { id, verdict, note: note ?? '', at };
    const line = JSON.stringify(decision) + '\n';
    fs.appendFileSync(path.join(REVIEWS, `${name}.jsonl`), line);
    send(res, 200, decision);
}

function sendImage(req, res, project, file) {
    const dir = PROJECTS[project];
    const name = path.basename(decodeURIComponent(file));
    const type = IMAGE_TYPES[path.extname(name).toLowerCase()];
    const full = dir && path.join(dir, name);
    if (!type || !full || !fs.existsSync(full))
        return sendError(res, 404, 'image not found');
    send(res, 200, fs.readFileSync(full), type);
}

function sendPage(req, res) {
    send(res, 200, fs.readFileSync(PAGE), HTML);
}

function sendQueues(req, res) {
    send(res, 200, listQueues());
}

function sendQueue(req, res, name) {
    send(res, 200, {
        items: readJsonl(path.join(QUEUES, `${name}.jsonl`)),
        decisions: latestDecisions(name)
    });
}

const routes = [
    [IMAGE_ROUTE, 'GET', sendImage],
    [PAGE_ROUTE, 'GET', sendPage],
    [QUEUES_ROUTE, 'GET', sendQueues],
    [QUEUE_ROUTE, 'GET', sendQueue],
    [DECISIONS_ROUTE, 'POST', recordDecision]
];

function route(req, res) {
    const url = new URL(req.url, 'http://localhost');
    for (const [pattern, method, handler] of routes) {
        const match = url.pathname.match(pattern);
        if (!match || req.method !== method) continue;
        const [, name, ...rest] = match;
        if (name !== undefined && !QUEUE_NAME.test(name))
            return sendError(res, 400, 'bad name');
        return handler(req, res, name, ...rest);
    }
    sendError(res, 404, 'not found');
}

function handleRequest(req, res) {
    Promise.resolve(route(req, res))
        .catch(error => sendError(res, 500, error.message));
}

http.createServer(handleRequest)
    .listen(PORT, '127.0.0.1', () => console.log(`review UI: http://127.0.0.1:${PORT}`));
