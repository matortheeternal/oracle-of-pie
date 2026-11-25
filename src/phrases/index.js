import SelfReference from './SelfReference.js';
import AttachedReference from './AttachedReference.js';
import AnyTarget from './AnyTarget.js';
import PlayerPhrase from './PlayerPhrase.js';
import ZonePhrase from './ZonePhrase.js';
import LibraryTopPhrase from './LibraryTopPhrase.js';
import BackReference from './BackReference.js';
import NounPhrase from './NounPhrase.js';
import AbilitiesPhrase from './AbilitiesPhrase.js';
import YouAndYourObjects from './YouAndYourObjects.js';

export const PHRASE_PARSERS = [
    AbilitiesPhrase, SelfReference, AttachedReference, AnyTarget, ZonePhrase,
    LibraryTopPhrase, YouAndYourObjects, PlayerPhrase, BackReference,
    NounPhrase
];
