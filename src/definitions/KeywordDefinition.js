import Definition from './Definition.js';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

export default class KeywordDefinition extends Definition {
    constructor(spec) {
        const reminders = spec.reminders?.length ? spec.reminders : [spec.reminder];
        super({ ...spec, reminder: reminders[0] });
        this.reminders = reminders.filter(Boolean);
        this.parameterPattern = spec.parameterPattern ?? null;
    }

    get patternSource() {
        return this.name.replace(REGEX_SPECIAL, '\\$&');
    }

    matchesName(name) {
        return name.toLowerCase() === this.key;
    }

    valuesFor(keyword) {
        return { parameter: keyword.parameter ?? '' };
    }
}
