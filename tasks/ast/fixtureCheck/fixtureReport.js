const INDENT = '    ';
const STATUS_WIDTH = 8;

function statusOf(comparison) {
    if (comparison.isFailing) return 'FAIL';
    return comparison.openPending.length ? 'PENDING' : 'PASS';
}

function heading(status, label) {
    return `${status.padEnd(STATUS_WIDTH)} ${label}`;
}

function mismatchLines(mismatches, prefix) {
    return mismatches.map(({ path, message }) => `${prefix}${path}: ${message}`);
}

function pendingLines(scope) {
    const state = scope.reached ? `${scope.mismatches.length} open` : 'not reached';
    return [
        `${INDENT}pending (${state}) ${scope.path}`,
        `${INDENT.repeat(2)}${scope.reason}`,
        ...mismatchLines(scope.mismatches, INDENT.repeat(3))
    ];
}

function resolvedLines(scope) {
    return [
        `${INDENT}now passes, remove pending: ${scope.path}`,
        `${INDENT.repeat(2)}${scope.reason}`
    ];
}

function openMarkerCount(comparisons) {
    const counts = comparisons.map(comparison => comparison.openPending.length);
    return counts.reduce((sum, count) => sum + count, 0);
}

export function fixtureLines(fixture, comparison) {
    return [
        heading(statusOf(comparison), `${fixture.id} (${fixture.name})`),
        ...mismatchLines(comparison.failures, `${INDENT}regression `),
        ...comparison.resolvedPending.flatMap(resolvedLines),
        ...comparison.openPending.flatMap(pendingLines)
    ];
}

export function errorLines(file, error) {
    return [heading('ERROR', file), `${INDENT}${error.message}`];
}

export function summaryLine(comparisons, errors) {
    const failing = comparisons.filter(comparison => comparison.isFailing).length;
    const total = comparisons.length + errors;
    const open = openMarkerCount(comparisons);
    const counts = `${failing} failing, ${errors} errors, ${open} open pending markers`;
    return `${total} fixtures: ${counts}`;
}
