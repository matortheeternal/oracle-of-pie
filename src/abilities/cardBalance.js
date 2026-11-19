function* ownEffectsOnYou(ability) {
    for (const [node, context] of ability.walk()) {
        if (context.granted || context.expansion) continue;
        if (node.affectsYou) yield node;
    }
}

export default function cardBalance(ability) {
    let balance = 0;
    for (const effect of ownEffectsOnYou(ability)) {
        const gained = effect.cardsGained;
        if (gained === null) return null;
        balance += gained;
    }
    return balance;
}
