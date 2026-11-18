const SYMBOL = /\{([^}]+)\}/g;
const COLOR = /[WUBRG]/g;

function symbolChoices(manaCost) {
    const choices = [];
    for (const [, symbol] of manaCost.matchAll(SYMBOL)) {
        const colors = symbol.match(COLOR);
        if (colors) choices.push(colors);
    }
    return choices;
}

function extend(payments, colors) {
    return payments.flatMap(payment => colors.map(color => [...payment, color]));
}

export default function hybridPayments(manaCost) {
    const payments = symbolChoices(manaCost).reduce(extend, [[]]);
    const keys = new Set();
    const unique = [];
    for (const payment of payments) {
        const colors = [...new Set(payment)].sort();
        const key = colors.join('');
        if (keys.has(key)) continue;
        keys.add(key);
        unique.push(colors);
    }
    return unique;
}
