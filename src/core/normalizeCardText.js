const NAME_MACRO = /\bCARDNAME\b|\bLEGENDNAME\b|@/g;
const DASH_BULLET = /^- /gm;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function escapeRegExp(str) {
    return str.replace(REGEX_SPECIAL, '\\$&');
}

function nameVariants(name) {
    const variants = [name, name.split(',')[0], name.split(' of ')[0]];
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
