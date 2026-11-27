export const HTML = 'text/html; charset=utf-8';
const JSON_TYPE = 'application/json';

export function send(res, status, body, type = JSON_TYPE) {
    res.writeHead(status, { 'Content-Type': type });
    res.end(type === JSON_TYPE ? JSON.stringify(body) : body);
}

export function sendError(res, status, error) {
    send(res, status, { error });
}

export function readBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data || '{}')));
        req.on('error', reject);
    });
}

export function searchParams(req) {
    return new URL(req.url, 'http://localhost').searchParams;
}
