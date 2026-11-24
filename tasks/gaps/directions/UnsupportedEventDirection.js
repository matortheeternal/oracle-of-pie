import GapDirection from './GapDirection.js';

const TRIGGERS_INDEX = 'src/triggers/index.js';

export default class UnsupportedEventDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'unsupported-event';
    }

    get title() {
        return 'Add a trigger event';
    }

    get steps() {
        return [
            'No trigger event class recognized this condition.',
            'Add a TriggerEvent subclass in src/triggers; ExertsEvent and '
                + 'CyclesEvent are small examples.',
            `Register it in ${TRIGGERS_INDEX}.`
        ];
    }

    get relatedClasses() {
        return [this.owner, 'ExertsEvent'];
    }

    get extraFiles() {
        return [TRIGGERS_INDEX];
    }
}
