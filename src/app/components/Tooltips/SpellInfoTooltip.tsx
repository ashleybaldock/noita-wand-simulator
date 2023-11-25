import styled from 'styled-components/macro';
import { Tooltip } from 'react-tooltip';
import { TooltipId } from './tooltipId';
import { getSpellById } from '../../calc/spells';
import { isValidActionId } from '../../calc/actionId';
import { formatYesNo, isNotNullOrUndefined } from '../../util';
import { translate } from '../../util/i18n';

const SpellTip = styled.div`
  display: grid;
  grid-template-areas:
    'sname  sname  sname'
    'sdesc  sdesc  sdesc'
    'sid    sid    simage  '
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
  background-color: rgba(5, 5, 5, 0.9);

  max-width: 300px;
  min-width: 200px;
  height: min-content;
  width: max-content;
  padding: 1em;

  font-family: 'noita', sans-serif;
  font-size: 0.8em;
  pointer-events: none;
`;
const Name = styled.div`
  grid-area: sname;
  margin-bottom: 0.6em;
`;
const Description = styled.div`
  grid-area: sdesc;
  margin-bottom: 0.6em;
`;
// const WikiLink = styled.a`
//   https: ; //noita.wiki.gg/wiki/${actionId}
// `;
const Sub = styled.div`
  margin-top: 0.4em;
`;
const Label = styled.div`
  grid-column: label;
`;
const Value = styled.div`
  grid-column: value;
  margin-left: 0.6em;
`;
const SpellId = styled.div`
  grid-area: sid;
  margin-top: 4px;
`;
const Image = styled.img`
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
const OUT = styled.div`
  target > && {
    transition: transform 200ms, visibility 100ms, opacity 100ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(0.6);
    opacity: 0;
    visibility: hidden;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
const IN = styled.div`
  target:hover > && {
    transition: transform 200ms, visibility 300ms, opacity 300ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(1);
    opacity: 1;
    visibility: visible;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledTooltip = styled(Tooltip)`
  z-index: var(--zindex-tooltips);
`;

export const SpellInfoTooltip = () => {
  return (
    <StyledTooltip
      id={'tooltip-spellinfo'}
      disableStyleInjection={true}
      closeEvents={{ mouseleave: false, blur: false, click: true }}
      render={({ content: actionId, activeAnchor }) => {
        if (!isNotNullOrUndefined(actionId) || !isValidActionId(actionId)) {
          return null;
        }
        const {
          name,
          description,
          sprite,
          type,
          mana,
          max_uses,
          never_unlimited,
          beta,
          spawn_requires_flag,
        } = getSpellById(actionId);
        return (
          <SpellTip>
            <Name>{translate(name)}</Name>
            <Description>{translate(description)}</Description>
            <SpellId>{actionId}</SpellId>
            <Image src={`/${sprite}`}></Image>
            <Label>Type</Label>
            <Value>{type}</Value>
            <Label>Mana Drain</Label>
            <Value>{mana}</Value>
            <Label>Uses</Label>
            <Value>
              {max_uses === undefined
                ? `Unlimited`
                : `${max_uses} (${formatYesNo(Boolean(never_unlimited))})`}
            </Value>
            <Label>Beta</Label>
            <Value>{formatYesNo(Boolean(beta))}</Value>
            {spawn_requires_flag !== undefined && (
              <>
                <Label>Unlock</Label>
                <Value>{spawn_requires_flag}</Value>
              </>
            )}
            <Label></Label>
            <Value></Value>
            <Label></Label>
            <Value></Value>
            <Label></Label>
            <Value></Value>
            <Label></Label>
            <Value></Value>
          </SpellTip>
        );
      }}
    />
  );
};
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
