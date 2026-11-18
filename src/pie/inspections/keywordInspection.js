import KeywordFamilyEvaluator from '../../evaluators/KeywordFamilyEvaluator.js';

const KEYWORDS_GROUP = 'Keywords';

function titleOf(keyword) {
    return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

function keywordTags(slug) {
    return [`gains-${slug}`, `gives-${slug}`, `${slug}-counter`];
}

export default function keywordInspection(keyword, { tiers, exceptions = [] } = {}) {
    const slug = KeywordFamilyEvaluator.slug(keyword);
    return {
        id: `keyword-${slug}`,
        title: titleOf(keyword),
        group: KEYWORDS_GROUP,
        tiers,
        exceptions,
        description: `Has, gains or gives ${keyword}, or puts ${keyword} counters.`,
        match: {
            any: [
                { kind: 'KeywordAbility', hasKeyword: keyword },
                { tag: keywordTags(slug) }
            ]
        }
    };
}

export function keywordInspections(tiersByKeyword) {
    return Object.entries(tiersByKeyword)
        .map(([keyword, tiers]) => keywordInspection(keyword, { tiers }));
}
