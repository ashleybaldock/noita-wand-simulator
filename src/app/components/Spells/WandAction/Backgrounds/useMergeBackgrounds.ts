import type { CSSProperties } from 'react';
import { objectEntries, objectKeys } from '../../../../util';
import { emptyBackgroundPart } from './BackgroundPart';
import type { BackgroundPart, BackgroundPartName } from './BackgroundPart';

const primary: BackgroundPartName = 'backgroundImage';

const combineParts = (parts: BackgroundPart[]): BackgroundPart => {
  const compress = (parts: BackgroundPart[]): BackgroundPart =>
    parts.reduce((acc: BackgroundPart, cur: BackgroundPart) => {
      objectKeys(acc).forEach(
        (backgroundPart) =>
          (acc[backgroundPart] = [
            ...(acc[backgroundPart] ?? []),
            ...cur[backgroundPart],
          ]),
      );
      return acc;
    }, emptyBackgroundPart());

  const normalisePartLengths = (parts: BackgroundPart[]): BackgroundPart[] => {
    parts.forEach((part) =>
      objectEntries(part).forEach(
        ([name, vals]) =>
          (part[name] = part[primary].flatMap((_, i) => vals[i % vals.length])),
      ),
    );
    return parts;
  };

  return compress(normalisePartLengths(parts));
};

const mergeProperties = (background: BackgroundPart): CSSProperties => {
  return objectEntries(background).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: k === 'cursor' ? v[v.length - 1] ?? '' : v.join(','),
    }),
    {},
  );
};

export const useMergedBackgrounds = (
  ...parts: BackgroundPart[]
): CSSProperties => mergeProperties(combineParts(parts));

// export const useMergedBackgroundVars = (
//   varMapFn: (property: BackgroundPartName) => string,
//   ...parts: BackgroundPart[]
// ): { [key: string]: string[] } => mapProperties(varMapFn, combineParts(parts));
