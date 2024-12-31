import type { AlwaysCastWandIndex, MainWandIndex } from '../redux/WandIndex';

export type Deck = Array<MainWandIndex | AlwaysCastWandIndex>;
export type Hand = Array<MainWandIndex | AlwaysCastWandIndex>;
export type Discard = Array<MainWandIndex | AlwaysCastWandIndex>;

/**
 * A point in time of the 'piles' spells move between
 *
 * Each pile is an ordered list of indexes into
 *  the original casting order
 */
export type SpellPileSnapshot = [deck: Deck, hand: Hand, discard: Discard];
