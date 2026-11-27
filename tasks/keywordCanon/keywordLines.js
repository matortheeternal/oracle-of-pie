const REMINDER = /\([^)]*\)/g;
const LINE_BREAK = /\n/;
const LIST_SEPARATOR = /[,;] /;
const SENTENCE_END = /\./;
const ABILITY_WORD_DASH = ' —';
const COST_DASH = '—';
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function startsWithKeyword(text, keyword) {
    const escaped = keyword.replace(REGEX_SPECIAL, '\\$&');
    return new RegExp(`^${escaped}(?![\\w'-])`, 'i').test(text);
}

function listedItem(line, keyword) {
    if (SENTENCE_END.test(line)) return null;
    const items = line.split(LIST_SEPARATOR);
    return items.find(item => startsWithKeyword(item, keyword)) ?? null;
}

function opensCostLine(line, keyword) {
    if (!startsWithKeyword(line, keyword)) return false;
    return line.slice(keyword.length).startsWith(COST_DASH);
}

function abilityText(line, keyword) {
    if (line.slice(keyword.length).startsWith(ABILITY_WORD_DASH)) return null;
    if (opensCostLine(line, keyword)) return line;
    return listedItem(line, keyword);
}

export function textLines(text) {
    return text.replace(REMINDER, '').split(LINE_BREAK).map(line => line.trim());
}

export function abilityTextIn(lines, keyword) {
    for (const line of lines) {
        const text = abilityText(line, keyword);
        if (text) return text;
    }
    return null;
}
