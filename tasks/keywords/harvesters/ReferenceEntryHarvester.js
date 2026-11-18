const REFERENCE_ENTRY = /^\*([A-Z][a-z]+(?:[ -][a-z]+)?)(?: \[[a-z]+\])?\*: (.+)$/;
const BRACKETED_PARAMETER = /\[[a-z]+\]/g;

export default class ReferenceEntryHarvester {
    static match(line) {
        return line.match(REFERENCE_ENTRY);
    }

    constructor(match) {
        [, this.name, this.text] = match;
    }

    get reminder() {
        return this.text.replace(BRACKETED_PARAMETER, '{parameter}');
    }
}
