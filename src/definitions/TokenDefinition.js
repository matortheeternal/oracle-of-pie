import Definition from './Definition.js';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

export default class TokenDefinition extends Definition {
    constructor({ name, typeLine = '', reminder }) {
        super({ name, reminder });
        this.typeLine = typeLine;
        const escaped = name.replace(REGEX_SPECIAL, '\\$&');
        this.namePattern = new RegExp(`(?<![\\w])${escaped}(?![\\w])`);
    }

    get isToken() {
        return true;
    }

    isNamedIn(description) {
        return this.namePattern.test(description);
    }
}
