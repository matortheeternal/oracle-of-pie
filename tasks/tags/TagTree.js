import { readJson } from '../shared/files.js';

const NON_ALPHANUMERIC = /[^\p{L}\p{N}]/gu;

export default class TagTree {
    static load(file) {
        return new TagTree(readJson(file));
    }

    static simplify(name) {
        return String(name).toLowerCase().replace(NON_ALPHANUMERIC, '');
    }

    constructor(info) {
        this.info = info;
        this.slugById = new Map();
        this.slugByAlias = new Map();
        this.ancestorCache = new Map();
        for (const [slug, tag] of Object.entries(info)) this.index(slug, tag);
    }

    index(slug, tag) {
        this.slugById.set(tag.id, slug);
        for (const name of [slug, ...(tag.aliases ?? [])])
            this.slugByAlias.set(TagTree.simplify(name), slug);
    }

    resolve(name) {
        return this.slugByAlias.get(TagTree.simplify(name)) ?? String(name);
    }

    has(slug) {
        return Object.hasOwn(this.info, slug);
    }

    describe(slug) {
        return `${slug} — ${this.info[slug]?.description || 'no description'}`;
    }

    ancestors(slug) {
        if (!this.ancestorCache.has(slug))
            this.ancestorCache.set(slug, this.findAncestors(slug));
        return this.ancestorCache.get(slug);
    }

    findAncestors(slug) {
        const found = new Set();
        for (const parentId of this.info[slug]?.parents ?? []) {
            const parent = this.slugById.get(parentId);
            if (!parent) continue;
            found.add(parent);
            this.ancestors(parent).forEach(ancestor => found.add(ancestor));
        }
        return found;
    }

    withAncestors(slugs) {
        const expanded = new Set(slugs);
        for (const slug of slugs)
            this.ancestors(slug).forEach(ancestor => expanded.add(ancestor));
        return expanded;
    }
}
