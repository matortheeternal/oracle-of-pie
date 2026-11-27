export default function tagInspection({ tag, ...spec }) {
    const name = tag ?? spec.id;
    return { scryfall: `otag:${name}`, ...spec, match: { tag: name } };
}
