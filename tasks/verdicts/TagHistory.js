const SETTLED_VERDICTS = 20;

export default class TagHistory {
    constructor() {
        this.correct = 0;
        this.wrong = 0;
    }

    add(verdict) {
        this[verdict]++;
    }

    get total() {
        return this.correct + this.wrong;
    }

    get isSettled() {
        return this.total >= SETTLED_VERDICTS && this.wrong === 0;
    }
}
