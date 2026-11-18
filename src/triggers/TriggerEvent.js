const SELF = /^(?:~|this [a-z]+)$/i;
const YOU = /^you$/i;

export default class TriggerEvent {
    static get pattern() {
        return null;
    }

    static match(text) {
        return text.match(this.pattern);
    }

    constructor(text, match) {
        this.text = text;
        this.subject = match.groups?.subject?.trim() ?? '';
    }

    get isSelf() {
        return SELF.test(this.subject);
    }

    get isYou() {
        return YOU.test(this.subject);
    }

    get isRepeatable() {
        return true;
    }

    toJSON() {
        return { event: this.constructor.name, subject: this.subject };
    }
}
