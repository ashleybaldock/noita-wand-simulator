import styled from 'styled-components';
import { TooltipBase } from './TooltipBase';
import { getSpellByActionId } from '../../calc/spells';
import { isValidActionId, type ActionId } from '../../calc/actionId';
import { isNotNullOrUndefined, isNotUndefined } from '../../util';
import { translate } from '../../util/i18n';
import { WithDebugHints } from '../Debug';
import { useHideTooltips } from './useHideTooltips';
import { getInfoForSpellField, type Spell } from '../../calc/spell';
import type { SpritePath } from '../../calc/sprite';

const StyledTooltipBase = styled(TooltipBase)`
  --tip-show-delay: 800ms;
`;

const SpellTooltipContainer = styled.div`
  display: grid;
  grid-template-areas:
    'sname  sname  sname'
    'sdesc  sdesc  sdesc'
    'sid    sid    simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage'
    'label  value  simage';

  border: 3px solid #928167;
  border-radius: 0px 7.5px 0px 7.5px;
  background-color: rgba(5, 5, 5, 0.96);
  color: rgb(250, 250, 250);
  filter: var(--filter-floating-shadow);

  max-width: 300px;
  min-width: 240px;
  height: min-content;
  width: auto;
  padding: 1em;

  font-family: var(--font-family-noita-default);
  font-size: 0.9em;
  pointer-events: none;
`;
const Name = styled.div`
  font-size: 1.3em;
  grid-area: sname;
  margin-bottom: 0.6em;
`;
const Description = styled.div`
  grid-area: sdesc;
  margin-bottom: 0.6em;
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
  margin-bottom: 0.2em;
  white-space: nowrap;

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

  padding: 0.1em 0em 0.1em 0.6em;
`;

const Stat = styled(
  ({
    label,
    value,
    className,
  }: {
    label: string;
    value: string;
    className?: string;
  }) => {
    return (
      <>
        <Label className={className}>{label}</Label>
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
  const { name, render } = getInfoForSpellField(field);
  return {
    label: name,
    value: render(spell),
  };
})``;

const SpellImage = styled.img.attrs<{ $src?: string }>(({ $src = '' }) => ({
  style: {
    content: `${$src ?? ''}`,
  },
}))`
  grid-column: simage;
  grid-row: simage / -1;
  display: flex;
  flex-direction: column;
  place-self: center center;
  margin-left: 0.6em;

  image-rendering: pixelated;
  width: 64px;
  height: 64px;
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
        } = getSpellByActionId(content);
        return (
          <SpellTooltipContainer>
            <Name>{translate(name)}</Name>
            <Description>{translate(description)}</Description>
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
            <SpellStat actionId={actionId} field={'recursive'}></SpellStat>
            <SpellStat actionId={actionId} field={'iterative'}></SpellStat>
            {isNotUndefined(spawn_requires_flag) && (
              <SpellStat
                actionId={actionId}
                field={'spawn_requires_flag'}
              ></SpellStat>
            )}
            <SpellStat actionId={actionId} field={'type'}></SpellStat>
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
