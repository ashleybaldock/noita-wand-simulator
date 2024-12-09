import { objectFromKeys, objectKeys } from '../../../../util';

export const backgroundPartLocations = ['before', 'on', 'after'] as const;

export type BackgoundPartLocation = (typeof backgroundPartLocations)[number];

const backgroundPartDefinition = {
  backgroundImage: { cssVar: 'bg-image', cssHoverVar: '--bg-image-hover' },
  backgroundRepeat: {
    cssVar: 'bg-repeat',
    cssHoverVar: '--bg-repeat-hover',
  },
  backgroundSize: { cssVar: 'bg-size', cssHoverVar: '--bg-size-hover' },
  backgroundPosition: {
    cssVar: 'bg-position',
    cssHoverVar: '--bg-position-hover',
  },
  cursor: { cssVar: 'cursor', cssHoverVar: '--cursor-hover' },
} as const;

export type BackgroundPartName = keyof typeof backgroundPartDefinition;

type BackgroundPartInfo = {
  cssVar: (typeof backgroundPartDefinition)[BackgroundPartName]['cssVar'];
  cssHoverVar: (typeof backgroundPartDefinition)[BackgroundPartName]['cssHoverVar'];
};

export type BackgroundPartInfoRecord = Readonly<
  Record<BackgroundPartName, Readonly<BackgroundPartInfo>>
>;

export const backgroundPartInfoRecord =
  backgroundPartDefinition as BackgroundPartInfoRecord;

export type BackgroundPart = Record<BackgroundPartName, readonly string[]>;

export type Background = Record<BackgoundPartLocation, BackgroundPart>;

export const emptyBackgroundPart = (): BackgroundPart =>
  objectFromKeys(objectKeys(backgroundPartDefinition), () => []);

export const emptyBackground = (): Background =>
  objectFromKeys(backgroundPartLocations, emptyBackgroundPart);

export const getCssVarForProperty = (property: BackgroundPartName) =>
  backgroundPartDefinition[property].cssVar;

export const getCssHoverVarForProperty = (property: BackgroundPartName) =>
  backgroundPartDefinition[property].cssHoverVar;
