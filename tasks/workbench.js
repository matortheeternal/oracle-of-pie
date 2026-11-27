import http from 'node:http';
import { sendError } from './workbench/http.js';
import { AST_ROUTES } from './workbench/astRoutes.js';
import { GAP_ROUTES } from './workbench/gapRoutes.js';
import { ASSET_ROUTES } from './workbench/assetRoutes.js';

const PORT = Number(process.env.PORT ?? 5178);
const ROUTES = [...AST_ROUTES, ...GAP_ROUTES, ...ASSET_ROUTES];

function route(req, res) {
    const { pathname } = new URL(req.url, 'http://localhost');
    for (const [pattern, method, handler] of ROUTES) {
        if (req.method !== method || !pattern.test(pathname)) continue;
        return handler(req, res);
    }
    sendError(res, 404, 'not found');
}

function handleRequest(req, res) {
    Promise.resolve().then(() => route(req, res))
        .catch(error => sendError(res, 500, error.message));
}

function announceWorkbench() {
    console.log(`Gap workbench: http://127.0.0.1:${PORT}/gaps`);
}

http.createServer(handleRequest).listen(PORT, '127.0.0.1', announceWorkbench);
