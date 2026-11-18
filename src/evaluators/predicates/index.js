import KindPredicate from './KindPredicate.js';
import AnyPredicate from './AnyPredicate.js';
import NotPredicate from './NotPredicate.js';
import CardPredicate from './CardPredicate.js';
import EffectOrderPredicate from './EffectOrderPredicate.js';
import AbsentPredicate from './AbsentPredicate.js';
import BooleanPredicate from './BooleanPredicate.js';
import PatternPredicate from './PatternPredicate.js';
import NestedPredicate from './NestedPredicate.js';
import OneOfPredicate from './OneOfPredicate.js';
import ValuePredicate from './ValuePredicate.js';

export const PREDICATES = [
    KindPredicate, AnyPredicate, NotPredicate, CardPredicate, EffectOrderPredicate,
    AbsentPredicate, BooleanPredicate, PatternPredicate, NestedPredicate, OneOfPredicate,
    ValuePredicate
];
