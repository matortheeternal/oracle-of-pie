import GapDirection from './GapDirection.js';

export default class AfterNodeDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'after';
    }

    get title() {
        return `Extend ${this.owner}`;
    }

    get steps() {
        return [
            `${this.owner} parsed the text before this and stopped here.`,
            `Extend ${this.owner} to read this text, or add a parser for what follows it.`
        ];
    }
}
