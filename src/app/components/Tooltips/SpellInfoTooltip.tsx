import styled from 'styled-components/macro';
import { Tooltip } from 'react-tooltip';
import { TooltipId } from './tooltipId';
import { getSpellById } from '../../calc/spells';
import { isValidActionId } from '../../calc/actionId';
import { isNotNullOrUndefined } from '../../util';

const SpellTip = styled.div`
	display: grid
	grid-template-areas:
		'sname  sname  simage'
		'sdesc  sdesc  simage'
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
	background-color: rgba(5,5,5,0.9);

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
  text-transform: uppercase;
`;
const Description = styled.div`
  grid-area: sdesc;
  margin-top: 0.6em;
`;
const Sub = styled.div`
  margin-top: 0.4em;
`;
const Label = styled.div`
  grid-column: label;
`;
const Value = styled.div`
  grid-column: value;
`;
const Image = styled.div`
  grid-row-start: simage-start;
  grid-row-end: simage-end;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

export const SpellInfoTooltip = () => {
  return (
    <Tooltip
      id={'tooltip-spellinfo'}
      border="1px solid red"
      closeEvents={{ mouseleave: true, blur: true, click: true }}
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
            <Name>{name}</Name>
            <Description>{description}</Description>
            <Label>ID</Label>
            <Value>{actionId}</Value>
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
