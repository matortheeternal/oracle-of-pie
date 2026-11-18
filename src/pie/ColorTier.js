const SEVERITY_NONE = 'none';
const WEAK_WARNING = 'weak-warning';
const WARNING = 'warning';

export default class ColorTier {
    constructor(name, rank, severity) {
        this.name = name;
        this.rank = rank;
        this.severity = severity;
    }

    get isFlagged() {
        return this.severity !== SEVERITY_NONE;
    }

    isWorseThan(other) {
        return this.rank > other.rank;
    }

    toJSON() {
        return this.name;
    }
}

export const PRIMARY = new ColorTier('primary', 0, SEVERITY_NONE);
export const SECONDARY = new ColorTier('secondary', 1, SEVERITY_NONE);
export const TERTIARY = new ColorTier('tertiary', 2, WEAK_WARNING);
export const NONE = new ColorTier('none', 3, WARNING);
