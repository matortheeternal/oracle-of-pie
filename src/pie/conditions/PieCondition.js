import Query from '../../evaluators/Query.js';

export default class PieCondition {
    constructor({ id, title, match, groups = [], inspections = [] }) {
        this.id = id;
        this.title = title;
        this.groups = groups;
        this.inspections = inspections;
        this.query = Query.compile(match);
    }

    get parameter() {
        return null;
    }

    appliesTo(inspection) {
        return this.groups.includes(inspection.group)
            || this.inspections.includes(inspection.id);
    }

    exceptionIdFor() {
        return this.id;
    }

    titleFor() {
        return this.title;
    }

    queryFor() {
        return this.query;
    }

    argumentsOf() {
        return {};
    }

    toJSON() {
        return { id: this.id, title: this.title, parameter: this.parameter };
    }
}
