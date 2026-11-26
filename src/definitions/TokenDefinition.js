import Definition from './Definition.js';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

export default class TokenDefinition extends Definition {
    constructor({ name, typeLine = '', reminder, aliases = null }) {
        super({ name, reminder });
        this.typeLine = typeLine;
        const escaped = name.replace(REGEX_SPECIAL, '\\$&');
        const names = aliases ? [name, ...aliases] : [];
        const alternatives = names.map(alias => alias.replace(REGEX_SPECIAL, '\\$&'));
        this.aliasPattern = alternatives.length
            ? new RegExp(`(?<![\\w])(?:${alternatives.join('|')})(?![\\w])`, 'i') : null;
        this.namePattern = new RegExp(`(?<![\\w])${escaped}(?![\\w])`);
    }

    get isToken() {
        return true;
    }

    isNamedIn(description) {
        return this.namePattern.test(description)
            || Boolean(this.aliasPattern?.test(description));
    }
}
