import styled, { type DataAttributes } from 'styled-components';
import type { GunActionState } from '../../../calc/actionState';
import type { TriggerCondition } from '../../../calc/trigger';
import { WithDebugHints } from '../../Debug';
import { Unchanged } from '../../Presentation';
import { useConfig, useWand } from '../../../redux';
import type { SpriteName } from '../../../calc/sprite';
import { useSpritePath } from '../../../calc/sprite';
import { castTableSections } from './ShotTableRowConfig';
import { Fragment } from 'react/jsx-runtime';
import { keyToRow } from '../../../util';
import type { WandCastProjectile } from '../../../calc/eval/WandCastProjectile';

// TODO: handle extra_entities that affect damage/etc

const ColSubGrid = styled.div.attrs<DataAttributes & { $dataName?: string }>(
  ({ $dataName }) => ({
    'data-name': $dataName,
  }),
)`
  grid-column: auto/span 1;
  grid-row: 2/-1;
  grid-template-columns: 1fr;
  grid-template-rows: subgrid;
  display: contents;
`;

const GridRowItem = styled.div.attrs<{ 'data-name'?: string }>(() => ({
  'data-name': 'GridRowItem',
}))<{
  row?: string;
  firstValue?: boolean;
  firstInGroup?: boolean;
  isTotal?: boolean;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  ${({ row }) => row && `grid-row: ${row}-start/${row}-end;`}

  height: 1em;
  line-height: 1.2em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  white-space: nowrap;
  padding: 0.2em;

  ${({ firstInGroup, firstValue }) =>
    firstInGroup
      ? firstValue
        ? `
  border-top: 1px dotted var(--color-vis-cs-inborder);
    `
        : `
  border-top: 1px dotted var(--color-vis-cs-inborder-dark);
    `
      : ``}
  ${({ isTotal }) =>
    isTotal
      ? `
  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;
  `
      : `
  border-left: 1px dotted var(--color-vis-cs-inborder-dark);
  `}
`;

const PropertyIcon = styled(GridRowItem).attrs<{
  background?: string;
  icon?: SpriteName;
  firstValue?: boolean;
  firstInGroup?: boolean;
  isTotal?: boolean;
}>(({ icon }) => ({
  background: useSpritePath(icon),
  'data-name': 'PropertyIcon',
}))`
  position: sticky;
  left: -10px;
  z-index: var(--zindex-stickyheader-shotgrid);
  background-position: center center;
  background-size: 1.1em;
  background-color: black;
  background-image: none;
  grid-column: icons-start/icons-end;
  ${({ background }) => background && `background-image: ${background};`}
`;

const PropertySection = styled(GridRowItem).attrs<{ $title: string }>(
  ({ $title }) => ({
    'data-name': 'PropertySection',
    'data-title': `${$title}`,
    $title,
  }),
)`
  flex: 0 0 150px;

  display: contents;
  grid-column: 1/-1;
  justify-content: start;
  font-size: 0.7em;
  width: 100%;
  height: 100%;
  outline: 1px dashed #333;
  background-color: transparent;
  z-index: 1;
  position: sticky;
  inset: auto auto auto 0;
}
`;

const PropertyName = styled(GridRowItem).attrs<{ 'data-name'?: string }>(
  () => ({
    'data-name': 'PropertyName',
  }),
)`
  grid-column: labels-start/labels-end;
  justify-content: end;
  padding-right: 0.3em;
  flex: 0 0 150px;
  background-color: black;
`;

const PropertyValue = styled(GridRowItem).attrs<{ 'data-name'?: string }>(
  () => ({
    'data-name': 'PropertyValue',
  }),
)`
  justify-content: center;
  padding-right: 0.4em;
  padding-left: 0.4em;
`;

const Ignored = styled.span`
  color: var(--color-value-ignored);
  &::before {
    content: 'ignored';
  }
`;

export const FieldNamesColumn = styled(
  ({
    castState,
    $dataName = 'Names',
  }: {
    castState?: GunActionState;
    $dataName?: string;
  }) => {
    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) => (
            <Fragment key={`${$dataName}-${title ? title : i1}`}>
              <PropertySection $title={title} row={keyToRow(title)}>
                {title}
              </PropertySection>
              {fields.map(({ key, displayName }, i2) => (
                <PropertyName
                  key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                  row={keyToRow(key)}
                  firstValue={i1 === 0}
                  firstInGroup={i2 === 0}
                >
                  {displayName}
                </PropertyName>
              ))}
            </Fragment>
          ))}
      </ColSubGrid>
    );
  },
)`
  & > [data-name='PropertyValue'] {
    grid-column: labels-start/labels-end;
  }

  ${WithDebugHints} && {
    background-color: #a0a;
  }
`;

export const IconsColumn = styled(
  ({
    castState,
    $dataName = 'Icons',
  }: {
    castState?: GunActionState;
    $dataName?: string;
  }) => {
    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, icon }, i2) => (
              <PropertyIcon
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                row={keyToRow(key)}
                firstValue={i1 === 0}
                firstInGroup={i2 === 0}
                icon={icon}
              />
            )),
          )}
      </ColSubGrid>
    );
  },
)`
  & > [data-name='PropertyIcon'] {
    grid-column: icons-start/icons-end;
  }

  ${WithDebugHints} && {
    background-color: #0aa;
  }
`;

export const TotalsColumn = styled(
  ({
    castState,
    manaDrain,
    insideTrigger = false,
    $dataName = 'Totals',
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
    showValues?: boolean;
    $dataName?: string;
  }) => {
    const config = useConfig();
    // const { castShowChanged } = config;

    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(
              (
                { key, render, ignoredInTrigger = false, noTotal = false },
                i2,
              ) => (
                <PropertyValue
                  key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                  row={keyToRow(key)}
                  firstValue={i1 === 0}
                  firstInGroup={i2 === 0}
                  isTotal={true}
                >
                  {insideTrigger && ignoredInTrigger ? (
                    <Ignored />
                  ) : noTotal ? (
                    <Unchanged />
                  ) : (
                    render(
                      {
                        ...castState,
                        insideTrigger: insideTrigger,
                        isTotal: true,
                        manaDrain: manaDrain,
                      },
                      config,
                    )
                  )}
                </PropertyValue>
              ),
            ),
          )}
      </ColSubGrid>
    );
  },
)`
  & > [data-name='PropertyValue'] {
    grid-column: totals-start/totals-end;
  }

  ${WithDebugHints} && {
    background-color: #00a;
  }
`;

export const WandStatsColumn = styled(
  ({
    castState,
    manaDrain,
    insideTrigger = false,
    $dataName = 'WandStats',
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
    showValues?: boolean;
    $dataName?: string;
  }) => {
    const config = useConfig();
    // const { castShowChanged } = config;
    const { cast_delay, spread, speed, reload_time } = useWand();
    const wandStats = new Map([
      ['reload_time', reload_time],
      ['fire_rate_wait', cast_delay],
      ['speed_multiplier', speed],
      ['spread_degrees', spread],
    ]);

    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, render }, i2) => (
              <PropertyValue
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                row={keyToRow(key)}
                firstValue={i1 === 0}
                firstInGroup={i2 === 0}
                isTotal={true}
              >
                {wandStats.has(key) ? (
                  render(
                    {
                      ...Object.fromEntries(wandStats),
                      insideTrigger: insideTrigger,
                      isTotal: false,
                      manaDrain: manaDrain,
                    },
                    config,
                  )
                ) : (
                  <Unchanged />
                )}
              </PropertyValue>
            )),
          )}
      </ColSubGrid>
    );
  },
)`
  & > [data-name='PropertyValue'] {
    grid-column: wand-start/wand-end;
  }

  ${WithDebugHints} && {
    background-color: #00a;
  }
`;

export const ProjectileColumn = styled(
  ({
    count = 1,
    castState,
    manaDrain,
    insideTrigger = false,
    projectile,
    $dataName = 'Projectile',
  }: {
    count?: number;
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    projectile: WandCastProjectile;
    $dataName?: string;
  }) => {
    const config = useConfig();
    // const { castShowChanged } = config;

    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, render, ignoredInTrigger = false }, i2) => (
              <PropertyValue
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                row={keyToRow(key)}
                firstValue={i1 === 0}
                firstInGroup={i2 === 0}
                isTotal={false}
              >
                {!insideTrigger || !ignoredInTrigger ? (
                  render(
                    {
                      ...castState,
                      isTotal: false,
                      insideTrigger: insideTrigger,
                      manaDrain: manaDrain,
                    },
                    config,
                  )
                ) : (
                  <Ignored />
                )}
              </PropertyValue>
            )),
          )}
      </ColSubGrid>
    );
  },
)`
  & > [data-name='PropertyValue'] {
    grid-column: projs-start/projs-end;
  }

  ${WithDebugHints} && {
    background-color: #0a0;
  }
`;

export const SubTotalsColumn = styled(TotalsColumn).attrs(() => ({
  $dataName: 'SubTotals',
}))`
  & > [data-name='PropertyValue'] {
    grid-column: subtotal-start/subtotal-end;
  }

  ${WithDebugHints} && {
    background-color: #a00;
  }
`;
