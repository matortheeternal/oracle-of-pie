import { DEFAULT_KEYWORDS } from '../defaultKeywords.js';

const NAME_MACRO = /\bCARDNAME\b|\bLEGENDNAME\b|@/g;
const DASH_BULLET = /^- /gm;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
const ROMAN_SUFFIX = / [IVXLC]+$/;
const FIRST_NAME = /^(\p{Lu}[\p{L}'’-]+) \p{Lu}/u;
const KEYWORDS = new Set(DEFAULT_KEYWORDS.map(keyword => keyword.toLowerCase()));
const SELF_ACTION = 'attacks?|blocks?|enters?|dies?|leaves?|deals?|fights?|connives?';
const ALIAS_CONTEXT = `(?='s (?:power|toughness|controller|owner|counters?)\\b`
    + `| (?:${SELF_ACTION})\\b)`;
const TYPAL_CONTEXT = /^(?: (?:artifact )?creature| tokens?)\b/i;

function escapeRegExp(str) {
    return str.replace(REGEX_SPECIAL, '\\$&');
}

export function nameVariants(name) {
    const variants = [
        name,
        name.split(',')[0],
        name.split(' of ')[0],
        name.split(' the ')[0],
        name.replace(ROMAN_SUFFIX, '')
    ];
    return [...new Set(variants.filter(Boolean))].sort((a, b) => b.length - a.length);
}

export function firstNameAlias(name) {
    return name.match(FIRST_NAME)?.[1] ?? null;
}

function replaceFirstName(text, name) {
    const first = firstNameAlias(name);
    if (!first) return text;
    const alias = new RegExp(
        `(?<![\\p{L}\\p{N}'"’-])${escapeRegExp(first)}${ALIAS_CONTEXT}`, 'gu'
    );
    return text.replace(alias, '~');
}

function replaceName(text, name) {
    if (!name) return text;
    const fullNames = nameVariants(name).reduce(
        (result, variant) => replaceVariant(result, variant, name), text
    );
    return replaceFirstName(fullNames, name);
}

function replaceVariant(text, variant, name) {
    const literal = escapeRegExp(variant);
    const pattern = new RegExp(`(?<![\\w])${literal}(?![\\w])`, 'g');
    if (variant === name) return text.replace(pattern, '~');
    const keyword = KEYWORDS.has(variant.toLowerCase());
    return text.replace(pattern, (match, index) => {
        if (TYPAL_CONTEXT.test(text.slice(index + match.length))) return match;
        if (keyword && (index === 0 || text[index - 1] === '\n')) return match;
        return '~';
    });
}

export default function normalizeCardText(text, name) {
    return replaceName(text, name)
        .replace(NAME_MACRO, '~')
        .replace(DASH_BULLET, '• ')
        .replace(/\r/g, '');
}
