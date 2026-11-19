function facesWith(card, keyword) {
    const lowercase = keyword.toLowerCase();
    return card.faces.filter(face => face.text.toLowerCase().includes(lowercase));
}

export function keywordColors(card, keyword) {
    const faces = facesWith(card, keyword);
    const colors = faces.length ? faces.flatMap(face => face.colors) : card.colors;
    return [...new Set(colors)];
}
