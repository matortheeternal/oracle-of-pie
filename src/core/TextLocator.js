import { firstNameAlias, nameVariants } from './normalizeCardText.js';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
const WHITESPACE = /\s+/;
const NAME_TOKEN = '~';
const BULLET = '•';
const NAME_MACROS = ['CARDNAME', 'LEGENDNAME', '@', '~'];
const REMOVED_REMINDER = '(?:\\s*\\([^()]*\\))?';
const GAP = `${REMOVED_REMINDER}\\s+`;
const BULLET_PATTERN = '[•-]';
const TRAILING_PUNCTUATION = /([.,;:]+)$/;

function escapeRegExp(str) {
    return str.replace(REGEX_SPECIAL, '\\$&');
}

function namePattern(name) {
    const source = name ?? '';
    const names = [...nameVariants(source), firstNameAlias(source), ...NAME_MACROS]
        .filter(Boolean);
    return `(?:${names.map(escapeRegExp).join('|')})`;
}

export default class TextLocator {
    constructor(source, name) {
        this.source = source;
        this.name = namePattern(name);
    }

    tokenPattern(token) {
        if (token === BULLET) return BULLET_PATTERN;
        const [word, punctuation = ''] = token.split(TRAILING_PUNCTUATION);
        const wordPattern = word.split(NAME_TOKEN).map(escapeRegExp).join(this.name);
        if (!punctuation) return wordPattern;
        return `${wordPattern}${REMOVED_REMINDER}${escapeRegExp(punctuation)}`;
    }

    pattern(fragment) {
        const tokens = fragment.trim().split(WHITESPACE).filter(Boolean);
        return new RegExp(tokens.map(token => this.tokenPattern(token)).join(GAP));
    }

    locate(fragment) {
        if (!fragment) return null;
        const match = this.source.match(this.pattern(fragment));
        if (!match) return null;
        return { start: match.index, end: match.index + match[0].length };
    }
}
