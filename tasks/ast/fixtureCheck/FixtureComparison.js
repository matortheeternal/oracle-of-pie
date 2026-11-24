import PendingScope from './PendingScope.js';
import pendingMarkers from './pendingMarkers.js';

export default class FixtureComparison {
    constructor() {
        this.failures = [];
        this.pending = [];
        this.scopes = [];
    }

    within(reason, path, compare) {
        if (!reason) return compare();
        const scope = new PendingScope(reason, path);
        this.pending.push(scope);
        this.scopes.push(scope);
        compare();
        this.scopes.pop();
    }

    mismatch(path, message) {
        const mismatch = { path, message };
        const scope = this.scopes.at(-1);
        if (scope) return scope.add(mismatch);
        this.failures.push(mismatch);
    }

    skip(expected, path, message) {
        this.mismatch(path, message);
        for (const { reason, path: markerPath } of pendingMarkers(expected, path))
            this.pending.push(PendingScope.unreached(reason, markerPath));
    }

    get resolvedPending() {
        return this.pending.filter(scope => scope.isResolved);
    }

    get openPending() {
        return this.pending.filter(scope => !scope.isResolved);
    }

    get isFailing() {
        return this.failures.length > 0 || this.resolvedPending.length > 0;
    }
}
