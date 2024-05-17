export const customActionIds = ['DRAW_EAT'] as const;

export type CustomActionId = (typeof customActionIds)[number];
