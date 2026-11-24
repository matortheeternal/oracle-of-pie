import GapDirection from './GapDirection.js';

export default class StartDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'start';
    }

    get title() {
        return `${this.owner} could not read its first part`;
    }

    get steps() {
        return [
            `None of the parsers ${this.owner} tries matched the start of this text.`,
            `Open ${this.owner} to see which parsers it consumes, then widen one `
                + 'or add a parser for this wording.'
        ];
    }
}
