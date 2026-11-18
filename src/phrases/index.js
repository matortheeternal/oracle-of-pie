import SelfReference from './SelfReference.js';
import AttachedReference from './AttachedReference.js';
import AnyTarget from './AnyTarget.js';
import PlayerPhrase from './PlayerPhrase.js';
import BackReference from './BackReference.js';
import NounPhrase from './NounPhrase.js';

export const PHRASE_PARSERS = [
    SelfReference, AttachedReference, AnyTarget, PlayerPhrase, BackReference, NounPhrase
];
