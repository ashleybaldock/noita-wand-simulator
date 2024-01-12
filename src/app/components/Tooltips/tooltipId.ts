const tooltipIds = ['tooltip-spellinfo', 'tooltip-actionhint'] as const;

export type TooltipId = (typeof tooltipIds)[number];
