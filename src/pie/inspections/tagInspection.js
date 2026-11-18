export default function tagInspection({ tag, ...spec }) {
    return { ...spec, match: { tag: tag ?? spec.id } };
}
