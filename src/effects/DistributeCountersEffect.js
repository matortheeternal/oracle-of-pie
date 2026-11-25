import PutCountersEffect from './PutCountersEffect.js';

const DISTRIBUTE = /^distributes? (?=\w+ [^,.]*counters? among )/i;
const AMONG = /^among /i;

export default class DistributeCountersEffect extends PutCountersEffect {
    static get pattern() {
        return DISTRIBUTE;
    }

    static get recipientPattern() {
        return AMONG;
    }
}
