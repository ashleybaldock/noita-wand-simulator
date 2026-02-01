import styled, { type DataAttributes } from 'styled-components';
import type { GunActionState } from '../../../calc/actionState';
import type { TriggerCondition } from '../../../calc/trigger';
import { WithDebugHints } from '../../Debug';
import { Unchanged } from '../../Presentation';
import { useConfig, useWand } from '../../../redux';
import type { SpriteName } from '../../../calc/sprite';
import { useIcon } from '../../../calc/sprite';
import { castTableSections } from './ShotTableRowConfig';
import { Fragment } from 'react/jsx-runtime';

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
`;

const GridRowItem = styled.div.attrs<{ 'data-name'?: string }>(() => ({
  'data-name': 'GridRowItem',
}))<{
  $row?: string;
  $firstValue?: boolean;
  $firstInGroup?: boolean;
  $isTotal?: boolean;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  ${({ $row }) => $row && `grid-row: ${$row};`}

  height: 1em;
  line-height: 1.2em;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  white-space: nowrap;
  padding: 0.2em;

  ${({ $firstInGroup, $firstValue }) =>
    $firstInGroup
      ? $firstValue
        ? `
  border-top: 1px dotted var(--color-vis-cs-inborder);
    `
        : `
  border-top: 1px dotted var(--color-vis-cs-inborder-dark);
    `
      : ``}
  ${({ $isTotal }) =>
    $isTotal
      ? `
  border-left: 1px dotted var(--color-vis-cs-inborder);
  background-color: black;
  `
      : `
  border-left: 1px dotted var(--color-vis-cs-inborder-dark);
  `}
`;

const PropertyIcon = styled(GridRowItem).attrs<{
  $background?: string;
  icon?: SpriteName;
  $firstValue?: boolean;
  $firstInGroup?: boolean;
  $isTotal?: boolean;
}>(({ icon }) => ({
  $background: useIcon(icon),
  'data-name': 'PropertyIcon',
}))`
  position: sticky;
  left: -10px;
  z-index: var(--zindex-stickyheader-shotgrid);
  background-position: center center;
  background-size: 1.1em;
  background-color: black;
  background-image: none;
  ${({ $background }) => $background && `background-image: ${$background};`}
`;

const PropertySection = styled(GridRowItem).attrs<{ $title: string }>(
  ({ $title }) => ({
    'data-name': 'PropertySection',
    'data-title': `${$title}`,
    $title,
  }),
)`
  justify-content: end;
  padding-right: 0.3em;
  flex: 0 0 150px;
  background-color: black;

  grid-column: 1/-1;
`;

const PropertyName = styled(GridRowItem).attrs<{ 'data-name'?: string }>(
  () => ({
    'data-name': 'PropertyName',
  }),
)`
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
    $dataName = 'ColNames',
  }: {
    castState?: GunActionState;
    $dataName?: string;
  }) => {
    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) => (
            <Fragment key={`${$dataName}-${title ? title : i1}`}>
              <PropertySection $title={title}></PropertySection>
              {fields.map(({ key, displayName }, i2) => (
                <PropertyName
                  key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                  $row={key}
                  $firstValue={i1 === 0}
                  $firstInGroup={i2 === 0}
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
  ${WithDebugHints} && {
    background-color: #a0a;
  }
`;

export const IconsColumn = styled(
  ({
    castState,
    $dataName = 'ColIcons',
  }: {
    castState?: GunActionState;
    $dataName?: string;
  }) => {
    return (
      <ColSubGrid data-name={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, icon }, i2) => (
              <PropertyIcon
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                icon={icon}
              />
            )),
          )}
      </ColSubGrid>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #0aa;
  }
`;

export const TotalsColumn = styled(
  ({
    castState,
    $manaDrain,
    $insideTrigger = false,
    $dataName = 'ColTotals',
  }: {
    castState?: GunActionState;
    $manaDrain?: number;
    $insideTrigger?: boolean;
    $triggerType?: TriggerCondition;
    showValues?: boolean;
    $dataName?: string;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <ColSubGrid data-name={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(
              (
                { key, render, ignoredInTrigger = false, noTotal = false },
                i2,
              ) => (
                <PropertyValue
                  key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                  $firstValue={i1 === 0}
                  $firstInGroup={i2 === 0}
                  $isTotal={true}
                >
                  {$insideTrigger && ignoredInTrigger ? (
                    <Ignored />
                  ) : noTotal ? (
                    <Unchanged />
                  ) : (
                    render(
                      {
                        ...castState,
                        insideTrigger: $insideTrigger,
                        isTotal: true,
                        manaDrain: $manaDrain,
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
  ${WithDebugHints} && {
    background-color: #00a;
  }
`;

export const WandStatsColumn = styled(
  ({
    castState,
    $manaDrain,
    $insideTrigger = false,
    $triggerType,
    $dataName = 'ColWandStats',
  }: {
    castState?: GunActionState;
    $manaDrain?: number;
    $insideTrigger?: boolean;
    $triggerType?: TriggerCondition;
    showValues?: boolean;
    $dataName?: string;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;
    const { cast_delay, spread, speed, reload_time } = useWand();
    const wandStats = new Map([
      ['reload_time', reload_time],
      ['fire_rate_wait', cast_delay],
      ['speed_multiplier', speed],
      ['spread_degrees', spread],
    ]);

    return (
      <ColSubGrid data-name={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, render }, i2) => (
              <PropertyValue
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $isTotal={true}
              >
                {wandStats.has(key) ? (
                  render(
                    {
                      ...Object.fromEntries(wandStats),
                      insideTrigger: $insideTrigger,
                      isTotal: false,
                      manaDrain: $manaDrain,
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
  ${WithDebugHints} && {
    background-color: #00a;
  }
`;

export const ProjectileColumn = styled(
  ({
    castState,
    $manaDrain,
    $insideTrigger = false,
    $dataName = 'ColProjectile',
  }: {
    castState?: GunActionState;
    $manaDrain?: number;
    $insideTrigger?: boolean;
    $dataName?: string;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <ColSubGrid $dataName={$dataName}>
        {castState &&
          castTableSections.map(({ title, fields }, i1) =>
            fields.map(({ key, render, ignoredInTrigger = false }, i2) => (
              <PropertyValue
                key={`${$dataName}-${title ? title : i1}-${key ? key : i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $isTotal={false}
              >
                {!$insideTrigger || !ignoredInTrigger ? (
                  render(
                    {
                      ...castState,
                      isTotal: false,
                      insideTrigger: $insideTrigger,
                      manaDrain: $manaDrain,
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
  ${WithDebugHints} && {
    background-color: #0a0;
  }
`;

export const SubTotalsColumn = styled(TotalsColumn).attrs(() => ({
  $dataName: 'ColSubTotal',
}))`
  ${WithDebugHints} && {
    background-color: #a00;
  }
`;
