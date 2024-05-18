import { useMemo } from 'react';
import { concat, mapIter, takeAll } from '../../../util';
import type { BackgroundPart, BackgroundPartName } from './BackgroundPart';

const capitalize = <T extends string>(s: T) =>
  (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;

const manglePropName = (propName: string) =>
  propName
    .split('-')
    .map((p, i) => (i === 0 ? p : capitalize(p)))
    .join('');

export const useMergedBackgrounds = ({
  cursorParts,
  dropHintParts,
  selectionParts,
}: {
  cursorParts: BackgroundPart;
  dropHintParts: BackgroundPart;
  selectionParts: BackgroundPart;
}) => {
  const propNamesInOrder: BackgroundPartName[] = [
    'background-image',
    'background-position',
    'background-repeat',
    'background-size',
  ];
  return useMemo(
    () =>
      Object.fromEntries(
        takeAll(
          mapIter(
            propNamesInOrder
              .map((propName) =>
                concat(
                  cursorParts[propName].values(),
                  dropHintParts[propName].values(),
                  selectionParts[propName].values(),
                ),
              )
              .values(),
            (x, i) => [
              manglePropName(propNamesInOrder[i]),
              takeAll(x).join(','),
            ],
          ),
        ),
      ),
    [cursorParts, dropHintParts, selectionParts],
  );
};
