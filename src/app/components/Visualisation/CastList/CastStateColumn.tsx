import styled from 'styled-components';
import type { GunActionState } from '../../../calc/actionState';
import type { TriggerCondition } from '../../../calc/trigger';
import { WithDebugHints } from '../../Debug';
import { Unchanged } from '../../Presentation';
import { useConfig, useWand } from '../../../redux';
import type { SpriteName } from '../../../calc/sprite';
import { useIcon } from '../../../calc/sprite';
import { castTableSections } from './ShotTableRowConfig';

// TODO: handle extra_entities that affect damage/etc

const ColSubGrid = styled.div.attrs<{ 'data-name'?: string }>(() => ({
  'data-name': 'ColSubGrid',
}))`
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

const PropertyName = styled(GridRowItem)`
  justify-content: end;
  padding-right: 0.3em;
  flex: 0 0 150px;
  background-color: black;
`;

const PropertyValue = styled(GridRowItem)`
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
  ({ castState }: { castState?: GunActionState }) => {
    return (
      <ColSubGrid>
        {castState &&
          castTableSections.map(({ fields }, i1) =>
            fields.map(({ key, displayName }, i2) => (
              <PropertyName
                key={key ?? `${i1}-${i2}-${key}`}
                $row={key}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
              >
                {displayName}
              </PropertyName>
            )),
          )}
      </ColSubGrid>
    );
  },
)`
  ${WithDebugHints} && {
    background-color: #a0a;
  }
`;

export const IconsColumn = styled(
  ({ castState }: { castState?: GunActionState }) => {
    return (
      <ColSubGrid>
        {castState &&
          castTableSections.map(({ fields }, i1) =>
            fields.map(({ key, icon }, i2) => (
              <PropertyIcon
                key={key ?? `${i1}-${i2}-${key}`}
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
    manaDrain,
    insideTrigger = false,
    triggerType,
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
    showValues?: boolean;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <ColSubGrid>
        {castState &&
          castTableSections.map(({ fields }, i1) =>
            fields.map(
              (
                { key, render, ignoredInTrigger = false, noTotal = false },
                i2,
              ) => (
                <PropertyValue
                  key={key ?? `${i1}-${i2}`}
                  $firstValue={i1 === 0}
                  $firstInGroup={i2 === 0}
                  $isTotal={true}
                >
                  {insideTrigger && ignoredInTrigger ? (
                    <Ignored />
                  ) : noTotal ? (
                    <Unchanged />
                  ) : (
                    render(
                      {
                        ...castState,
                        insideTrigger,
                        isTotal: true,
                        manaDrain,
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
    manaDrain,
    insideTrigger = false,
    triggerType,
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
    triggerType?: TriggerCondition;
    showValues?: boolean;
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
      <ColSubGrid>
        {castState &&
          castTableSections.map(({ fields }, i1) =>
            fields.map(({ key, render }, i2) => (
              <PropertyValue
                key={key ? `wandStats-${key}` : `wandStats-${i1}-${i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $isTotal={true}
              >
                {wandStats.has(key) ? (
                  render(
                    {
                      ...Object.fromEntries(wandStats),
                      insideTrigger: false,
                      isTotal: false,
                      manaDrain,
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
    manaDrain,
    insideTrigger = false,
  }: {
    castState?: GunActionState;
    manaDrain?: number;
    insideTrigger?: boolean;
  }) => {
    const config = useConfig();
    const { castShowChanged } = config;

    return (
      <ColSubGrid>
        {castState &&
          castTableSections.map(({ fields }, i1) =>
            fields.map(({ key, render, ignoredInTrigger = false }, i2) => (
              <PropertyValue
                key={key ?? `${i1}-${i2}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                $isTotal={false}
              >
                {!insideTrigger || !ignoredInTrigger ? (
                  render(
                    {
                      ...castState,
                      isTotal: false,
                      insideTrigger,
                      manaDrain,
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

export const SubTotalsColumn = styled(TotalsColumn)`
  ${WithDebugHints} && {
    background-color: #a00;
  }
`;
