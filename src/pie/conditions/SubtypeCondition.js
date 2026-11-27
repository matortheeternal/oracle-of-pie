import Query from '../../evaluators/Query.js';
import PieCondition from './PieCondition.js';

function subtypeMatch(subtype) {
    const isType = { hasSubtype: subtype };
    return { any: [{ card: isType }, { subject: isType }, { phrases: isType }] };
}

export default class SubtypeCondition extends PieCondition {
    constructor({ id, title }) {
        super({ id, title, match: {} });
    }

    get parameter() {
        return 'subtype';
    }

    appliesTo() {
        return true;
    }

    exceptionIdFor({ subtype }) {
        return `${this.id}:${subtype.toLowerCase()}`;
    }

    titleFor({ subtype }) {
        return `${subtype} creatures`;
    }

    queryFor({ subtype }) {
        return Query.compile(subtypeMatch(subtype));
    }

    argumentsOf({ subtype }) {
        return { subtype };
    }
}
