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

function listsKeyword(line, keyword) {
    if (SENTENCE_END.test(line)) return false;
    return line.split(LIST_SEPARATOR).some(item => startsWithKeyword(item, keyword));
}

function opensCostLine(line, keyword) {
    if (!startsWithKeyword(line, keyword)) return false;
    return line.slice(keyword.length).startsWith(COST_DASH);
}

function isAbilityLine(line, keyword) {
    if (line.slice(keyword.length).startsWith(ABILITY_WORD_DASH)) return false;
    return listsKeyword(line, keyword) || opensCostLine(line, keyword);
}

export function textLines(text) {
    return text.replace(REMINDER, '').split(LINE_BREAK).map(line => line.trim());
}

export function hasAbilityLine(lines, keyword) {
    return lines.some(line => isAbilityLine(line, keyword));
}
