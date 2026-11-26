const LINE_BREAK = /\r?\n/;
const SOFT_END = /[\t ]$/;
const COMPLETE = /[.!?;:)"”\]]$/;
const STRUCTURAL_START = new RegExp(
    '^(?:[•*—–-]|\\[|\\{|\\d+(?:[-–—|+]|\\s*[-–—|])|[IVXLCDM]+\\s*[,—–-])'
);
const LOWERCASE_START = /^[a-z]/;
const QUANTITY_START = /^(?:[0-9]+|[Xx]) (?:life|damage|cards?|counters?)\b/;
const CONTINUATION_END = new RegExp(
    '\\b(?:add|and|attach|cast|choose|create|deals?|discard|draw|exile|for|from|gains?'
        + '|gets?|into|loses?|of|on|onto|or|pay|put|return|search|to|with|without)\\b$',
    'i'
);

function isConfirmedContinuation(left, right, canRead) {
    if (!LOWERCASE_START.test(right)) return false;
    if (canRead(left) || canRead(right)) return false;
    return canRead(left + ' ' + right);
}

function hasContinuation(end, start, wrapped, canRead) {
    if (end.endsWith(',') && wrapped) return true;
    if (CONTINUATION_END.test(end))
        return LOWERCASE_START.test(start) || QUANTITY_START.test(start);
    if (wrapped && LOWERCASE_START.test(start)) return true;
    return isConfirmedContinuation(end, start, canRead);
}

function continues(left, right, canRead) {
    const end = left.trimEnd();
    const start = right.trimStart();
    if (!end || !start) return false;
    if (COMPLETE.test(end) || STRUCTURAL_START.test(start)) return false;
    return hasContinuation(end, start, SOFT_END.test(left), canRead);
}

export default function repairWrappedRules(text, canRead) {
    const lines = text.split(LINE_BREAK);
    const repaired = [lines[0]];
    for (const line of lines.slice(1)) {
        const previous = repaired.at(-1);
        if (!continues(previous, line, canRead)) {
            repaired.push(line);
            continue;
        }
        repaired[repaired.length - 1] = previous.trimEnd() + ' ' + line.trimStart();
    }
    return repaired.join('\n');
}
