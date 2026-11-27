import AstService from '../ast/AstService.js';
import GapService from '../gaps/GapService.js';

let astService = null;
let gapService = null;

export function sharedAstService() {
    astService ??= new AstService();
    return astService;
}

export function sharedGapService() {
    gapService ??= new GapService(sharedAstService());
    return gapService;
}
