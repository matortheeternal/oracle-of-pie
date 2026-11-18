import { NotImplementedError } from '../core/customErrors.js';

export default class TagRule {
    static get tag() {
        throw new NotImplementedError('tag');
    }

    static get nodeClass() {
        throw new NotImplementedError('nodeClass');
    }

    static matches(node, context) {
        return node instanceof this.nodeClass && this.test(node, context);
    }

    static test(node, context) {
        throw new NotImplementedError('test');
    }
}
