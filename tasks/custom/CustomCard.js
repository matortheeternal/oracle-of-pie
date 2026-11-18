import fs from 'node:fs';
import path from 'node:path';
import customFace from './customFace.js';

const FACE_KEYS = ['front', 'back'];
const IMAGE_SUFFIXES = ['.jpg', '.png', '.webp'];
const NOT_PLAYABLE = new Set(['ad']);

function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export default class CustomCard {
    static facesOf(data) {
        return FACE_KEYS.map(key => data?.[key]).filter(isObject);
    }

    constructor({ project, projectDir, stem, data }) {
        this.project = project;
        this.projectDir = projectDir;
        this.stem = stem;
        this.data = data;
        this.rawFaces = CustomCard.facesOf(data);
        this.faces = this.rawFaces.map(customFace);
    }

    get id() {
        return `${this.project}:${this.stem}`;
    }

    get name() {
        return this.rawFaces[0].name || this.stem;
    }

    get rarity() {
        return this.rawFaces[0].rarity ?? '';
    }

    get isPlayable() {
        return !NOT_PLAYABLE.has(this.rarity);
    }

    get userTags() {
        return this.data.tags ?? [];
    }

    get imageCandidates() {
        const exported = this.data.imageExports?.front;
        const named = IMAGE_SUFFIXES.map(suffix => `${this.name}${suffix}`);
        return exported ? [exported, ...named] : named;
    }

    get imageUrl() {
        const images = path.join(this.projectDir, 'dist', 'images');
        const exists = name => fs.existsSync(path.join(images, name));
        const file = this.imageCandidates.find(exists);
        return file ? `/files/${this.project}/${path.basename(file)}` : null;
    }

    get view() {
        const { name, rarity, faces, imageUrl } = this;
        return { name, rarity, faces, image: imageUrl };
    }
}
