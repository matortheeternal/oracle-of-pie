import GapDirection from './GapDirection.js';

export default class IncompleteDirection extends GapDirection {
    static matches(gap) {
        return gap.kind === 'incomplete';
    }

    get title() {
        return `${this.nodeKind} is incomplete`;
    }

    get steps() {
        return [
            `${this.nodeKind} read this text and all of its children are `
                + 'recognized, but its own isRecognized is false.',
            `Check the isRecognized getter of ${this.nodeKind} (or its base class) `
                + 'to see what it still requires, such as a NounPhrase without a type.',
            'Either teach the class to accept this wording, or make the parser that '
                + 'created it stop before this text.'
        ];
    }

    get relatedClasses() {
        return [this.nodeKind, this.owner];
    }
}
