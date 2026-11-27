import PieCondition from './PieCondition.js';

const WARD = ['keyword-ward'];

export const LIFE_COST = new PieCondition({
    id: 'life-cost',
    title: 'Ward costs paid in life',
    match: { kind: 'KeywordAbility', paysLifeCost: true },
    inspections: WARD
});

export const NON_MANA_COST = new PieCondition({
    id: 'non-mana-cost',
    title: 'Non-mana ward costs',
    match: { kind: 'KeywordAbility', not: { hasManaCostKeyword: 'ward' } },
    inspections: WARD
});

export const SACRIFICE_COST = new PieCondition({
    id: 'sacrifice-cost',
    title: 'Mana paid for by sacrificing another permanent',
    match: { context: { ability: { cost: { sacrificesOther: true } } } },
    groups: ['Mana & lands']
});
