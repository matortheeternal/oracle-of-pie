const NAME = '[A-Z][a-z]+(?:[ -][a-z]+)?';
const PARAMETER = '(?:\\{[^}]+\\})+|\\d+|X';
const REMINDER_LINE = new RegExp(`^(${NAME})(?: (${PARAMETER}))? \\(([^)]+)\\)$`);
const PARAMETER_PLACEHOLDER = '{parameter}';

export default class ReminderLineHarvester {
    static match(line) {
        return line.match(REMINDER_LINE);
    }

    constructor(match) {
        [, this.name, this.parameter, this.text] = match;
    }

    get reminderType() {
        return 'static';
    }

    get reminder() {
        if (!this.parameter) return this.text;
        return this.text.split(this.parameter).join(PARAMETER_PLACEHOLDER);
    }
}
