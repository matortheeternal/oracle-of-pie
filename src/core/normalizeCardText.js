const NAME_MACRO = /\bCARDNAME\b|\bLEGENDNAME\b|@/g;
const DASH_BULLET = /^- /gm;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
const ROMAN_SUFFIX = / [IVXLC]+$/;

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

function replaceName(text, name) {
    if (!name) return text;
    return nameVariants(name).reduce((result, variant) => {
        const pattern = new RegExp(`(?<![\\w])${escapeRegExp(variant)}(?![\\w])`, 'g');
        return result.replace(pattern, '~');
    }, text);
}

export default function normalizeCardText(text, name) {
    return replaceName(text, name)
        .replace(NAME_MACRO, '~')
        .replace(DASH_BULLET, '• ')
        .replace(/\r/g, '');
}
