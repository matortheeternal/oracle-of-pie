const COMMA = ', ';

export default function splitTrigger(scribe, rest) {
    let index = rest.indexOf(COMMA);
    while (index >= 0) {
        const body = rest.slice(index + COMMA.length);
        if (scribe.startsClause(body)) return [rest.slice(0, index), body];
        index = rest.indexOf(COMMA, index + 1);
    }
    return null;
}
