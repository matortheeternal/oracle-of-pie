import { createHash } from 'node:crypto';

function sampleKey(name) {
    return createHash('sha1').update(name).digest('hex');
}

export default function sampleFlaggedCards(flags, size) {
    const names = [...new Set(flags.map(flag => flag.name))];
    names.sort((a, b) => sampleKey(a).localeCompare(sampleKey(b)));
    const sampled = new Set(names.slice(0, size));
    return flags.filter(flag => sampled.has(flag.name));
}
