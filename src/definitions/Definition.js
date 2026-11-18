const PLACEHOLDER = /\{(\w+)\}/g;

export default class Definition {
    constructor({ name, reminder }) {
        this.name = name;
        this.reminder = reminder;
        Object.defineProperty(this, 'parsedTexts', { value: new Map() });
    }

    get isToken() {
        return false;
    }

    get key() {
        return this.name.toLowerCase();
    }

    valuesFor(node) {
        return {};
    }

    textFor(node) {
        const values = this.valuesFor(node);
        const fill = (placeholder, key) => values[key] ?? placeholder;
        return this.reminder.replace(PLACEHOLDER, fill);
    }

    parse(scribe, node) {
        const text = this.textFor(node);
        if (!this.parsedTexts.has(text))
            this.parsedTexts.set(text, scribe.parseText(text));
        return this.parsedTexts.get(text);
    }
}
