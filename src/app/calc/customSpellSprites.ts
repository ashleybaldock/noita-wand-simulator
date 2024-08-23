export const customSpellSprites = [
  ['icon.spell.DRAW_EAT', 'var(--sprite-action-draw-eat)'],
] as const;

export type CustomSpellSpriteName = (typeof customSpellSprites)[number][0];
export type CustomSpellSpritePath = (typeof customSpellSprites)[number][1];
