import { useMemo } from 'react';
import { flatMapIter, mapIter, takeAll } from '../../../util';
import type { BackgroundPart, BackgroundPartName } from './BackgroundPart';

export const useMergeBackgrounds = (...parts: BackgroundPart[]) => {
  const orderedNames = new Set<BackgroundPartName>([
    'background-image',
    'background-repeat',
    'background-size',
    'background-position',
    'cursor',
  ]);

  return useMemo(
    () =>
      Object.fromEntries(
        takeAll(
          mapIter(
            orderedNames.entries(),
            ([propName, [cssvar, csshovervar]]) => [
              propName,
              `${takeAll(
                flatMapIter(parts.values(), (part) => part[propName].values()),
              ).join(',')}`,
            ],
          ),
        ),
      ),
    [parts],
  );
};
// return useMemo(
//   () =>
//     Object.fromEntries(
//       takeAll(
//         mapIter(
//           orderedNames.keys()
//             .map((propName) =>
//               flatMapIter(parts.values(), (part) => part[propName].values()),
//             )
//             .values(),
//           (x, i) => [
//             manglePropName(propNamesInOrder[i]),
//             takeAll(x).join(','),
//           ],
//         ),
//       ),
//     ),
//   [parts],
// );
// };
