const MANA_TOKEN = /\d+|[WUBRGCSP]\/[WUBRGCP]|[WUBRGCXYZS]/g;
const NAME_MACRO = /@|CARDNAME|LEGENDNAME/g;
const DASH_BULLET = /^- /gm;

function manaCost(face) {
    const symbols = String(face.manaCost?.symbols ?? '').toUpperCase();
    return (symbols.match(MANA_TOKEN) ?? []).map(token => `{${token}}`).join('');
}

function typeLine(face) {
    const superType = (face.superType ?? '').trim();
    const subType = (face.subType ?? '').trim();
    return subType ? `${superType} — ${subType}` : superType;
}

function colors(face) {
    const chars = (face.colors ?? []).map(color => color.char).filter(Boolean);
    return chars.map(char => char.toUpperCase());
}

function rulesText(face) {
    const text = (face.rulesText ?? '').replace(NAME_MACRO, '~');
    return text.replace(DASH_BULLET, '• ').trim();
}

export default function customFace(face) {
    return {
        name: face.name ?? '',
        type_line: typeLine(face),
        mana_cost: manaCost(face),
        colors: colors(face),
        oracle_text: rulesText(face),
        loyalty: face.loyalty ?? null
    };
}
