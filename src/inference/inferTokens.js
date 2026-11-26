const TOKEN = /\btoken\b/i;
const TITLE = /,\s+/;
const WORD = /[\p{L}\p{N}]/u;

function tokenFace(card, face) {
    const typeLine = face.typeLine ?? face.type_line ?? '';
    const name = face.name ?? card.name;
    if (!name || !WORD.test(name)) return null;
    if (card.layout !== 'token' && !TOKEN.test(typeLine)) return null;
    return { name, typeLine, aliases: aliasesOf(name, face.aliases) };
}

function aliasesOf(name, explicit = []) {
    const shortName = name.split(TITLE)[0];
    const aliases = new Set(explicit);
    if (shortName !== name) aliases.add(shortName);
    return [...aliases].filter(alias => WORD.test(alias));
}

function addFace(tokens, card, face) {
    const token = tokenFace(card, face);
    if (!token || tokens.has(token.name)) return;
    tokens.set(token.name, token);
}

function addCard(tokens, card) {
    for (const face of card.faces) addFace(tokens, card, face);
}

export default function inferTokens(cards) {
    const tokens = new Map();
    for (const card of cards) addCard(tokens, card);
    return [...tokens.values()];
}
