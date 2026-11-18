export default class SeededRandom {
    constructor(seed) {
        this.state = seed >>> 0;
    }

    next() {
        this.state = (this.state + 0x6D2B79F5) >>> 0;
        let value = this.state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    }

    sample(values, count) {
        const pool = [...values];
        const size = Math.min(count, pool.length);
        for (let index = 0; index < size; index++) this.swapRandomInto(pool, index);
        return pool.slice(0, size);
    }

    swapRandomInto(pool, index) {
        const other = index + Math.floor(this.next() * (pool.length - index));
        [pool[index], pool[other]] = [pool[other], pool[index]];
    }
}
