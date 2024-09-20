import { manglePropName, objectEntries, objectKeys } from '../../../../util';
import {
  emptyBackgroundPart,
  type BackgroundPart,
  type BackgroundPartName,
} from './BackgroundPart';

const primary: BackgroundPartName = 'background-image';

const mapProperties = (
  mapFn: (name: BackgroundPartName) => string,
  properties: Record<BackgroundPartName, readonly unknown[]>,
) => {
  return objectEntries(properties).reduce(
    (acc, [k, v]) => ({ ...acc, [mapFn(k)]: v }),
    {},
  );
};

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

export const useMergedBackgrounds = (
  ...parts: BackgroundPart[]
): { [key: string]: string[] } =>
  mapProperties(manglePropName, combineParts(parts));

export const useMergedBackgroundVars = (
  varMapFn: (property: BackgroundPartName) => string,
  ...parts: BackgroundPart[]
): { [key: string]: string[] } => mapProperties(varMapFn, combineParts(parts));
