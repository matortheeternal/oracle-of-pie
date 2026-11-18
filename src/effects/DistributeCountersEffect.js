import PutCountersEffect from './PutCountersEffect.js';

const DISTRIBUTE = /^distributes? (?=\w+ [^,.]*counters? among )/i;
const DISTRIBUTED_KIND = /^([+\-−]\d+\/[+\-−]\d+|[a-z]+) counters? among /i;

export default class DistributeCountersEffect extends PutCountersEffect {
    static get pattern() {
        return DISTRIBUTE;
    }

    get kindPattern() {
        return DISTRIBUTED_KIND;
    }
}
