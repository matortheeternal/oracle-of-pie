export default class PendingScope {
    static unreached(reason, path) {
        const scope = new PendingScope(reason, path);
        scope.reached = false;
        return scope;
    }

    constructor(reason, path) {
        this.reason = reason;
        this.path = path;
        this.reached = true;
        this.mismatches = [];
    }

    add(mismatch) {
        this.mismatches.push(mismatch);
    }

    get isResolved() {
        return this.reached && !this.mismatches.length;
    }
}
