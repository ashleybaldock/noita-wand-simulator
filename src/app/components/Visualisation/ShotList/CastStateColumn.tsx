import styled from 'styled-components';
import type { GunActionState } from '../../../calc/actionState';
import type { TriggerCondition } from '../../../calc/trigger';
import { WithDebugHints } from '../../Debug';
import { Unchanged } from '../../Presentation';
import { useConfig, useWand } from '../../../redux';
import type { SpriteName } from '../../../calc/sprite';
import { useIcon } from '../../../calc/sprite';
import { shotTableSections } from './ShotTableRowConfig';

// TODO: handle extra_entities that affect damage/etc

const GridRowItem = styled.div<{
  $firstValue?: boolean;
  $firstInGroup?: boolean;
  $isTotal?: boolean;
}>`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;

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

const StyledPropertyIcon = styled(GridRowItem)<{ $background?: string }>`
  position: sticky;
  left: -10px;
  z-index: var(--zindex-stickyheader-shotgrid);
  background-position: center center;
  background-size: 1.1em;
  background-color: black;
  background-image: none;
  ${(props) => props?.$background && `background-image: ${props.$background};`}
`;

const PropertyIcon = ({
  $firstValue,
  $firstInGroup,
  $isTotal,
  icon,
  className,
}: {
  $firstValue?: boolean;
  $firstInGroup?: boolean;
  $isTotal?: boolean;
  icon?: SpriteName;
  className?: string;
}) => {
  const iconPath = useIcon(icon);
  return (
    <StyledPropertyIcon
      className={className}
      $background={iconPath}
      $firstValue={$firstValue}
      $firstInGroup={$firstInGroup}
      $isTotal={$isTotal}
    ></StyledPropertyIcon>
  );
};

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

type FileType = 'xml' | 'png' | 'text';
const FileTypeIconMap: Record<FileType, string> = {
  xml: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z%22%3E%3C/path%3E%3C/svg%3E');`,
  png: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z%22%3E%3C/path%3E%3C/svg%3E');`,
  text: `background-image: url('data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 384 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z%22%3E%3C/path%3E%3C/svg%3E');`,
} as const;

const FilePath = styled.span<{
  type: FileType;
}>`
  display: block;
  &::before {
    content: '';
    padding: 0 0.6em 0 0.7em;
    ${({ type }) => FileTypeIconMap[type]}
    background-position: 0 50%;
    background-size: 0.7em;
    background-repeat: no-repeat;
    image-rendering: pixelated;
  }
`;

export const FieldNamesColumn = styled(
  ({ castState }: { castState?: GunActionState }) => {
    return (
      <>
        {castState &&
          shotTableSections.map(({ fields }, i1) =>
            fields.map(({ key, displayName }, i2) => (
              <PropertyName
                key={key ?? `${i1}-${i2}-${key}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
              >
                {displayName}
              </PropertyName>
            )),
          )}
      </>
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
      <>
        {castState &&
          shotTableSections.map(({ fields }, i1) =>
            fields.map(({ key, icon }, i2) => (
              <PropertyIcon
                key={key ?? `${i1}-${i2}-${key}`}
                $firstValue={i1 === 0}
                $firstInGroup={i2 === 0}
                icon={icon}
              />
            )),
          )}
      </>
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
      <>
        {castState &&
          shotTableSections.map(({ fields }, i1) =>
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
      </>
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
      <>
        {castState &&
          shotTableSections.map(({ fields }, i1) =>
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
      </>
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
      <>
        {castState &&
          shotTableSections.map(({ fields }, i1) =>
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
      </>
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
