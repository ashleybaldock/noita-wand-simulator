export const customSpellSprites = ['var(--sprite-action-draw-eat)'] as const;

export type CustomSpellSprite = (typeof customSpellSprites)[number];
