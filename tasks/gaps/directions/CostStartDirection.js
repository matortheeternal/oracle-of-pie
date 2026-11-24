import GapDirection from './GapDirection.js';

export default class CostStartDirection extends GapDirection {
    static matches(gap) {
        return gap.site.type === 'start' && gap.site.owner === 'CostList';
    }

    get title() {
        return 'Add a cost item';
    }

    get steps() {
        return [
            'No cost parser in CostList recognized this cost.',
            'Add the wording to TextCost when it is a simple action, or add a CostItem '
                + 'subclass in src/costs and register it in COST_PARSERS (CostList.js).'
        ];
    }

    get relatedClasses() {
        return ['CostList', 'TextCost', 'CostItem'];
    }
}
