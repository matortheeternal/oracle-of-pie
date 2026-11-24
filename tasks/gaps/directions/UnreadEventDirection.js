import GapDirection from './GapDirection.js';

export default class UnreadEventDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'event';
    }

    get title() {
        return `Extend ${this.owner}`;
    }

    get steps() {
        return [
            `${this.owner} matched the start of the trigger but left this text unread.`,
            'Extend its pattern, or add the wording to the shared trigger parts in '
                + 'src/triggers/qualifiers, src/triggers/subjects and '
                + 'src/triggers/objects.'
        ];
    }
}
