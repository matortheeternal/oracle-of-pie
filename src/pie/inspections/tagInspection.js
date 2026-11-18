export default function tagInspection(id, title, tag = id) {
    return { id, title, match: { tag } };
}
