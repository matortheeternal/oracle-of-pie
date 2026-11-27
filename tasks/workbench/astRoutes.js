import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sharedAstService as astService } from './services.js';
import { HTML, send, sendError, readBody, searchParams } from './http.js';

const PAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'ast.html');
const AST_PAGE_ROUTE = /^\/ast$/;
const SEARCH_ROUTE = /^\/api\/ast\/search$/;
const CARD_ROUTE = /^\/api\/ast\/card$/;
const PARSE_ROUTE = /^\/api\/ast\/parse$/;

function sendPage(req, res) {
    send(res, 200, fs.readFileSync(PAGE), HTML);
}

function sendSearch(req, res) {
    send(res, 200, astService().search(searchParams(req).get('q') ?? ''));
}

function sendCard(req, res) {
    const result = astService().inspectName(searchParams(req).get('name') ?? '');
    if (!result) return sendError(res, 404, 'card not found');
    send(res, 200, result);
}

async function sendParse(req, res) {
    send(res, 200, astService().inspectText(await readBody(req)));
}

export const AST_ROUTES = [
    [AST_PAGE_ROUTE, 'GET', sendPage],
    [SEARCH_ROUTE, 'GET', sendSearch],
    [CARD_ROUTE, 'GET', sendCard],
    [PARSE_ROUTE, 'POST', sendParse]
];
