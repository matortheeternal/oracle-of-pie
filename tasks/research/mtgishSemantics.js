const TRIGGER = /^Trigger[A-Z]/;
const MANA_COLOR = /^ManaCost([WUBRG])$/;
const KEYWORDS = {
    Flying: 'flying', FirstStrike: 'first strike', DoubleStrike: 'double strike',
    Deathtouch: 'deathtouch', Haste: 'haste', Hexproof: 'hexproof',
    Indestructible: 'indestructible', Lifelink: 'lifelink', Menace: 'menace',
    Reach: 'reach', Trample: 'trample', Vigilance: 'vigilance',
    Defender: 'defender', Flash: 'flash', Prowess: 'prowess'
};
const ACTION_TAGS = {
    DrawACard: 'draw', DrawNumberCards: 'draw', DrawCardsForEach: 'draw',
    GainLife: 'lifegain', GainLifeForEach: 'lifegain',
    Scry: 'scry', Surveil: 'surveil', MillNumberCards: 'mill-self'
};
const BLOCKED_TYPES = new Set([
    '_Trigger', '_Condition', '_Cost', '_CostPlayerAction', '_Target',
    '_Permanents', '_Permanent', '_Cards', '_Card', '_GameNumber',
    '_LayerEffect', '_ReplacementActionWouldDraw'
]);
const PLAYER_WRAPPERS = new Set([
    'PlayerAction', 'EachPlayerAction', 'EachPlayerMayAction'
]);
const DRAW_ACTIONS = new Set(['DrawACard', 'DrawNumberCards']);
const DISCARD_ACTIONS = new Set(['DiscardACard', 'DiscardNumberCards']);

export const SPIKE_TAGS = [
    'activated-ability', 'triggered-ability', 'draw', 'lifegain',
    'scry', 'surveil', 'mill-self', 'loot', 'rummage'
];

export const SPIKE_INSPECTIONS = [
    'draw-cards', 'gain-life', 'mill-self', 'loot', 'rummage',
    ...Object.values(KEYWORDS).map(name => `keyword-${name.replaceAll(' ', '-')}`)
];

export function* objects(value) {
    if (!value || typeof value !== 'object') return;
    if (!Array.isArray(value)) yield value;
    for (const child of Object.values(value)) yield* objects(child);
}

function abilityColors(cost) {
    const colors = new Set();
    for (const node of objects(cost)) {
        const match = MANA_COLOR.exec(node._ManaSymbol ?? '');
        if (match) colors.add(match[1]);
    }
    return [...colors];
}

function sequenceTags(node, found) {
    if (node._Actions !== 'ActionList') return;
    const actions = node.args.map(action => action._Action);
    const draw = actions.findIndex(action => DRAW_ACTIONS.has(action));
    const discard = actions.findIndex(action => DISCARD_ACTIONS.has(action));
    if (draw < 0 || discard < 0) return;
    found.add(draw < discard ? 'loot' : 'rummage');
}

function actionChildren(node) {
    if (!PLAYER_WRAPPERS.has(node._Action)) return Object.values(node);
    const [player, action] = node.args;
    const isYou = player._Player === 'You' || player._Players === 'You';
    return isYou ? [action] : [];
}

function visit(value, found) {
    if (!value || typeof value !== 'object') return;
    if (Object.keys(value).some(key => BLOCKED_TYPES.has(key))) return;
    const tag = ACTION_TAGS[value._Action];
    if (tag) found.add(tag);
    sequenceTags(value, found);
    for (const child of actionChildren(value)) visit(child, found);
}

function activatedBody(rule, tags) {
    const [cost, body] = rule.args;
    tags.add('activated-ability');
    visit(body, tags);
    const discards = [...objects(cost)].some(node => DISCARD_ACTIONS.has(node._Cost));
    if (discards && tags.has('draw')) tags.add('rummage');
    return abilityColors(cost);
}

export function analyzeRule(rule) {
    const tags = new Set();
    const keyword = KEYWORDS[rule._Rule];
    if (keyword === 'lifelink') tags.add('lifegain');
    if (TRIGGER.test(rule._Rule)) tags.add('triggered-ability');
    if (rule._Rule === 'Activated')
        return { tags, keyword, colors: activatedBody(rule, tags) };
    visit(rule, tags);
    return { tags, keyword, colors: [] };
}

export function cardFaces(card) {
    return [...objects(card)].filter(node => Array.isArray(node.Rules));
}
