import StateCondition from './StateCondition.js';

const MONARCH = /^while you're the monarch\b/i;

export default class MonarchCondition extends StateCondition {
    static get pattern() {
        return MONARCH;
    }
}
