export function percent(value, digits = 1) {
    return `${(value * 100).toFixed(digits)}%`;
}

export function formatRow(cells, widths) {
    return cells.map((cell, index) => alignCell(String(cell), widths[index])).join(' ');
}

function alignCell(text, width) {
    return width < 0 ? text.padEnd(-width) : text.padStart(width);
}
