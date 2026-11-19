function isObject(value) {
    return value !== null && typeof value === 'object';
}

function childEntries(value) {
    if (Array.isArray(value)) return value.map((item, index) => [`[${index}]`, item]);
    return Object.entries(value).map(([key, item]) => [`.${key}`, item]);
}

function markerOf(value, path) {
    const isPendingNode = !Array.isArray(value) && value.pending;
    return isPendingNode ? [{ reason: value.pending, path }] : [];
}

function collect(value, path, markers) {
    if (!isObject(value)) return;
    markers.push(...markerOf(value, path));
    for (const [suffix, item] of childEntries(value))
        collect(item, `${path}${suffix}`, markers);
}

export default function pendingMarkers(value, path) {
    const markers = [];
    collect(value, path, markers);
    return markers;
}
