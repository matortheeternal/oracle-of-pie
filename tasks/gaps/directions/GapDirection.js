const EFFECTS_INDEX = 'src/effects/index.js';

export default class GapDirection {
    static matches() {
        return false;
    }

    constructor(gap, sources) {
        this.gap = gap;
        this.sources = sources;
    }

    get owner() {
        return this.gap.site.owner;
    }

    get nodeKind() {
        return this.gap.node.constructor.name;
    }

    get effectsIndex() {
        return EFFECTS_INDEX;
    }

    get relatedClasses() {
        return [this.owner];
    }

    get extraFiles() {
        return [];
    }

    get files() {
        const classFiles = this.relatedClasses.map(name => this.sources.fileFor(name));
        return [...new Set([...classFiles, ...this.extraFiles].filter(Boolean))];
    }

    toJSON() {
        return { title: this.title, steps: this.steps, files: this.files };
    }
}
