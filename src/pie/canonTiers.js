import { COLORS } from './ColorProfile.js';

export const PRIMARY_RATIO = 0.5;
export const SECONDARY_RATIO = 0.1;
export const SECONDARY_MIN_CARDS = 5;
export const TERTIARY_RATIO = 0.02;
export const TERTIARY_MIN_CARDS = 2;

function tierNameFor(ratio, count) {
    if (ratio >= PRIMARY_RATIO) return 'primary';
    if (ratio >= SECONDARY_RATIO && count >= SECONDARY_MIN_CARDS) return 'secondary';
    if (ratio >= TERTIARY_RATIO && count >= TERTIARY_MIN_CARDS) return 'tertiary';
    return 'none';
}

export default function canonTiers(profile) {
    const rates = COLORS.map(color => profile.rateOf(color, null));
    const top = Math.max(...rates) || 1;
    const entries = COLORS.map((color, index) =>
        [color, tierNameFor(rates[index] / top, profile.countOf(color, null))]);
    return Object.fromEntries(entries);
}
