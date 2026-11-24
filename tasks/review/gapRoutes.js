import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { sharedGapService as gapService } from './services.js';
import { HTML, send, sendError, readBody, searchParams } from './http.js';

const REVIEW_UI = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.join(REVIEW_UI, 'gaps.html');
const GAP_REPORT_SCRIPT = path.join(REVIEW_UI, '..', 'gapReport.js');
const NO_REPORT = 'no gap report yet; press "Refresh report" or run npm run gaps';
const PAGE_ROUTE = /^\/gaps$/;
const LIST_ROUTE = /^\/api\/gaps$/;
const DETAIL_ROUTE = /^\/api\/gaps\/detail$/;
const CARD_ROUTE = /^\/api\/gaps\/card$/;
const RECHECK_ROUTE = /^\/api\/gaps\/recheck$/;
const REFRESH_ROUTE = /^\/api\/gaps\/refresh$/;
const run = promisify(execFile);

function sendPage(req, res) {
    send(res, 200, fs.readFileSync(PAGE), HTML);
}

function sendResult(res, result, missing) {
    if (!result) return sendError(res, 404, missing);
    send(res, 200, result);
}

function sendList(req, res) {
    sendResult(res, gapService().list(), NO_REPORT);
}

function sendDetail(req, res) {
    const shape = searchParams(req).get('shape') ?? '';
    sendResult(res, gapService().detail(shape), 'gap not found');
}

function sendCard(req, res) {
    const params = searchParams(req);
    const card = gapService().card(params.get('shape') ?? '', params.get('name') ?? '');
    sendResult(res, card, 'card not found');
}

async function sendRecheck(req, res) {
    const { shape } = await readBody(req);
    sendResult(res, gapService().recheck(shape ?? ''), 'gap not found');
}

async function refreshReport(req, res) {
    await run(process.execPath, [GAP_REPORT_SCRIPT, '0']);
    sendResult(res, gapService().list(), NO_REPORT);
}

export const GAP_ROUTES = [
    [PAGE_ROUTE, 'GET', sendPage],
    [LIST_ROUTE, 'GET', sendList],
    [DETAIL_ROUTE, 'GET', sendDetail],
    [CARD_ROUTE, 'GET', sendCard],
    [RECHECK_ROUTE, 'POST', sendRecheck],
    [REFRESH_ROUTE, 'POST', refreshReport]
];
