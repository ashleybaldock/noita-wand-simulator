export const backgroundParts = [
  'background-image',
  'background-repeat',
  'background-size',
  'background-position',
  'cursor',
] as const;

export const emptyBackgroundPart = {
  'background-image': [],
  'background-repeat': [],
  'background-size': [],
  'background-position': [],
  'cursor': [],
};

export type BackgroundPartName = (typeof backgroundParts)[number];

export type BackgroundPart = Record<BackgroundPartName, string[]>;

export type BackgroundPartSet = {
  before: BackgroundPart;
  after: BackgroundPart;
};
