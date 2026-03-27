import styled from 'styled-components';
import { TooltipBase } from './TooltipBase';
import { getSpellByActionId } from '../../calc/spells';
import { isValidActionId, type ActionId } from '../../calc/actionId';
import { isNotNullOrUndefined, isNotUndefined } from '../../util';
import { translate } from '../../util/i18n';
import { WithDebugHints } from '../Debug';
import { useHideTooltips } from './useHideTooltips';
import { getInfoForSpellField, type Spell } from '../../calc/spell';
import { useSprite, type Sprite, type SpritePath } from '../../calc/sprite';
import {
  getColoursForSpellType,
  getSpriteForSpellType,
  type SpellType,
} from '../../calc/spellTypes';

const StyledTooltipBase = styled(TooltipBase)`
  --tip-show-delay: 800ms;
`;

const SpellTooltipContainer = styled.div.attrs<{
  spellType: SpellType;
}>(({ spellType }) => ({
  style: {
    '--sprite-spelltype': getSpriteForSpellType(spellType).path,
    '--color-spelltype-light': getColoursForSpellType(spellType).light,
    '--color-spelltype-dark': getColoursForSpellType(spellType).dark,
  },
}))`
  image-rendering: pixelated;

  display: grid;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  row-gap: 0;
  column-gap: 0;

  grid-auto-rows: 100fr;
  grid-auto-flow: row;
  row-gap: 0;
  column-gap: 0;

  white-space: normal;

  border-image-source: var(--sprite-spelltype);
  border-image-width: 8px 8px 0 0;
  border-image-slice: 8 8 0 24;
  border-image-outset: 0px 4px;
  border-radius: 2px;
  background-color: rgba(5, 5, 5, 0.9);
  color: rgb(250, 250, 250);
  filter: var(--filter-floating-shadow);

  box-shadow:
    inset 2px -2px 6px -2px var(--color-spelltype-light),
    3px 3px 2px 0 #000;

  min-width: unset;
  max-height: round(down, clamp(200px, 30vmax, 100vh), 1px);
  max-width: round(down, clamp(200px, 30vmax, 100vw), 1px);
  width: fit-content;
  height: fit-content;
  padding: 18px 18px 9px 18px;

  font-family: var(--font-family-noita-default);
  font-size: 0.9em;
  pointer-events: none;

  grid-auto-rows: 100fr;
  grid-auto-flow: row;
  row-gap: 0;
  column-gap: 0;
  grid-template-columns: [left sname-start sdesc-start label-start] 1fr 1fr [label-end value-start] 1fr [sdesc-end sname-end] 1fr [simage-start] 0 [simage-end value-end right];
  grid-template-rows: [top sname-start simage-start] 200fr [sname-end sdesc-start] auto [sdesc-end simage-end stats-start] repeat( 8, 100fr ) [stats-end bottom];
  grid-auto-flow: row;
  white-space: normal;
  border-image-source: var(--sprite-spelltype);
  border-image-width: 8px 8px 0 0;
  border-image-slice: 8 8 0 24;
  border-image-outset: 0px 4px;
  border-radius: 2px;
  background-color: rgba(5, 5, 5, 0.9);
  color: rgb(250, 250, 250);
  filter: var(--filter-floating-shadow);
  box-shadow: inset 2px -2px 6px -2px var(--color-spelltype-light),3px 3px 2px 0 #000;
  min-width: unset;
  max-height: round(down, clamp(200px, 30vmax, 100vh), 1px);
  max-width: round(down, clamp(200px, 30vmax, 100vw), 1px);
  width: fit-content;
  height: fit-content;
  padding: 18px 18px 9px 18px;
  font-family: var(--font-family-noita-default);
  font-size: 0.9em;
  pointer-events: none;
}
`;
const Name = styled.div`
  font-size: 1.3em;
  grid-area: sname;
  margin-bottom: 0.6em;
`;
const GameDescription = styled.div`
  grid-area: sdesc;
  margin-bottom: 0.6em;

  &::before {
    content: '"';
    font-size: 0.9em;
    margin: 0 0.25ch 0 -0.5ch;
    vertical-align: top;
  }

  &::after {
    content: '"';
    font-size: 0.9em;
    margin: 0 0 0 0.25ch;
    vertical-align: top;
  }
`;
const SpellId = styled.div`
  display: none;
  ${WithDebugHints} & {
    display: flex;
  }
  grid-area: sid;
  margin-bottom: 0.6em;
  margin-top: -0.3em;
  font-size: 0.6em;
`;
const WikiLink = styled.a.attrs<{ actionId: ActionId }>(({ actionId }) => ({
  href: `https://noita.wiki.gg/wiki/${actionId}`,
}))``;

const Label = styled.div.attrs<{ icon?: SpritePath }>(() => ({}))`
  grid-column: label;
  white-space: nowrap;
  margin-right: 1ch;

  ${({ icon }) =>
    icon &&
    `
  background-image: ${icon};
  background-size: 1.2em;
  background-position: left center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  padding: 0.1em 0.6em 0.1em 2.2em;
  `}
`;
const Value = styled.div`
  grid-column: value;

  padding: 0;
  justify-self: end;
  margin-right: 1ch;
`;

const Stat = styled(
  ({
    label,
    icon,
    value,
    className,
  }: {
    label: string;
    icon?: Sprite;
    value: string;
    className?: string;
  }) => {
    return (
      <>
        <Label className={className} icon={icon?.path}>
          {label}
        </Label>
        <Value>{value}</Value>
      </>
    );
  },
)``;

const SpellStat = styled(Stat).attrs<{
  actionId: ActionId;
  field: keyof Spell;
  label?: string;
  value?: string;
}>(({ actionId, field }) => {
  const spell = getSpellByActionId(actionId);
  const { name, icon: sprite = 'none', render } = getInfoForSpellField(field);
  return {
    label: name,
    icon: useSprite(sprite),
    value: render(spell),
  };
})``;

const SpellImage = styled.img.attrs<{ $src?: string }>(({ $src = '' }) => ({
  style: {
    content: `${$src ?? ''}`,
  },
}))`
  grid-column: simage;
  grid-row: simage;
  justify-self: center;
  align-self: center;

  display: flex;
  flex-direction: column;

  image-rendering: pixelated;

  width: auto;
  height: round(down, clamp(48px, 9vmax, 128px), 1px);

  display: flex;
  image-rendering: pixelated;
  margin: -2.8em 1em 1em -1em;
  filter: drop-shadow(4px 0 0 #000) drop-shadow(-4px 0 0 #000)
    drop-shadow(0 -4px 0 #000) drop-shadow(0 4px 0 #000)
    drop-shadow(0 0 4px #fff4);
  filter: drop-shadow(0 0 0.1px #fff) drop-shadow(4px 0 0 #000)
    drop-shadow(-4px 0 0 #000) drop-shadow(0 -4px 0 #000)
    drop-shadow(0 4px 0 #000) drop-shadow(0 0 4px #fff4);
`;

export const SpellInfoTooltip = ({
  className = '',
}: {
  className?: string;
}) => {
  const [hidden, tooltipRef] = useHideTooltips();

  return (
    <StyledTooltipBase
      className={className}
      id={'tooltip-spellinfo'}
      data-name={'SpellInfoTooltip'}
      hidden={hidden}
      ref={tooltipRef}
      disableStyleInjection={true}
      offset={30}
      place={'top-start'}
      closeEvents={{
        // mouseleave: true,
        blur: true,
        click: true,
      }}
      globalCloseEvents={{
        scroll: true,
        resize: true,
      }}
      render={({ content }) => {
        if (!isNotNullOrUndefined(content) || !isValidActionId(content)) {
          return null;
        }
        const {
          id: actionId,
          name,
          description,
          sprite,
          type,
          mana,
          max_uses,
          never_unlimited,
          spawn_requires_flag,
          recursive,
          iterative,
          related_projectiles,
          related_extra_entities,
        } = getSpellByActionId(content);
        return (
          <SpellTooltipContainer spellType={type}>
            <Name>{translate(name)}</Name>
            <GameDescription>{translate(description)}</GameDescription>
            <SpellId>{actionId}</SpellId>
            <SpellImage $src={sprite} />

            <SpellStat actionId={actionId} field={'type'}></SpellStat>
            <SpellStat actionId={actionId} field={'mana'}></SpellStat>
            <SpellStat actionId={actionId} field={'max_uses'}></SpellStat>
            <SpellStat actionId={actionId} field={'uses_remaining'}></SpellStat>
            <SpellStat
              actionId={actionId}
              field={'never_unlimited'}
            ></SpellStat>
            {recursive && (
              <SpellStat actionId={actionId} field={'recursive'}></SpellStat>
            )}
            {iterative && (
              <SpellStat actionId={actionId} field={'iterative'}></SpellStat>
            )}
            {isNotUndefined(spawn_requires_flag) && (
              <SpellStat
                actionId={actionId}
                field={'spawn_requires_flag'}
              ></SpellStat>
            )}
            {related_extra_entities && (
              <SpellStat
                actionId={actionId}
                field={'related_extra_entities'}
              ></SpellStat>
            )}
            {related_projectiles && (
              <SpellStat
                actionId={actionId}
                field={'related_projectiles'}
              ></SpellStat>
            )}
          </SpellTooltipContainer>
        );
      }}
    />
  );
};

//             <Label>Friendly-Fire</Label>
//             <Value>--</Value>
//             <Label>Piercing</Label>
//             <Value>--</Value>
//             <Label>Penetrating</Label>
//             <Value>--</Value>
//             <Label></Label>
//             <Value></Value>
//             <Label></Label>
//             <Value></Value>

/*{
    title: 'Action Info',
    fields: [
// {field: 'action_id', displayName: 'ID', render: ({: v}) => `${v}`},
      {
        field: 'action_name',
        displayName: 'Name',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_description',
        displayName: 'Desc.',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_type',
        displayName: 'Type',
render: ({: v}) => `${v}`,
      },

      {
        field: 'action_draw_many_count',
        displayName: 'Draw',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_never_unlimited',
        displayName: 'Never Unlimited',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_max_uses',
        displayName: 'Max. Charges',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_mana_drain',
        displayName: 'Mana',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_level',
        displayName: 'Spawn Level',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_probability',
        displayName: 'Spawn Probability',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_requires_flag',
        displayName: 'Spawn Requires Flag',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_spawn_manual_unlock',
        displayName: 'Spawn Manual Unlock',
render: ({: v}) => `${v}`,
      },
      {
        field: 'action_ai_never_uses',
        displayName: 'AI Never Uses',
render: ({: v}) => `${v}`,
      },
    ],
  },*/
