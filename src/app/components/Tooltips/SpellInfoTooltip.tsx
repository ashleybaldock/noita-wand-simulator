import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { TooltipId } from './tooltipId';
import { getSpellById } from '../../calc/spells';
import { isValidActionId } from '../../calc/actionId';
import { isNotNullOrUndefined } from '../../util';
import { translate } from '../../util/i18n';
import { spellTypeInfoMap } from '../../calc/spellTypes';
import { WithDebugHints } from '../Debug';
import { getSpriteForPerk, Perk } from '../../calc/perks';
import { getUnlockName } from '../../calc/unlocks';
import { YesNo } from '../Presentation';

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
  background-color: rgba(5, 5, 5, 0.96);
  color: rgb(250, 250, 250);

  max-width: 300px;
  min-width: 240px;
  height: min-content;
  width: auto;
  padding: 1em;

  font-family: 'noita', sans-serif;
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
// const WikiLink = styled.a`
//   https: ; //noita.wiki.gg/wiki/${actionId}
// `;
const Sub = styled.div`
  margin-top: 0.4em;
`;

const Label = styled.div.attrs<{ iconSrc?: string }>(({ iconSrc }) => ({
  style:
    iconSrc !== undefined
      ? {
          backgroundImage: `url('/${iconSrc}')`,
        }
      : {},
}))`
  grid-column: label;
  margin-bottom: 0.2em;
  white-space: nowrap;

  background-size: 1.2em;
  background-position: left center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  padding: 0.1em 0.6em 0.1em 2.2em;
`;
const Value = styled.div`
  grid-column: value;

  padding: 0.1em 0em 0.1em 0.6em;
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

const StyledTooltip = styled(Tooltip)`
  z-index: var(--zindex-tooltips);

  min-width: 240px;

  &.show {
    opacity: var(--rt-opacity);
    transition: opacity var(--rt-transition-show-delay) ease-out;

    transition: transform 200ms, visibility 300ms, opacity 300ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(1);
    visibility: visible;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &.closing {
    transition: opacity var(--rt-transition-closing-delay) ease-in;
    transition: transform 200ms, visibility 100ms, opacity 100ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(0.6);
    visibility: hidden;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
`;

const InlineIcon = styled.span.attrs<{
  perk?: Perk;
}>(({ perk }) => ({
  style: {
    backgroundImage: `url('${getSpriteForPerk(perk)}')`,
  },
}))`
  display: inline-block;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 1em;
  image-rendering: pixelated;
  width: 1em;
  height: 1em;
`;

export const SpellInfoTooltip = () => {
  return (
    <StyledTooltip
      id={'tooltip-spellinfo'}
      disableStyleInjection={true}
      offset={10}
      closeEvents={{
        mouseleave: true,
        blur: true,
        click: true,
      }}
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
            <Value>{spellTypeInfoMap[type].name}</Value>
            <Label iconSrc={'data/wand/icon_mana_drain.png'}>Mana Drain</Label>
            <Value>{mana}</Value>
            <Label iconSrc={'data/wand/icon_action_max_uses.png'}>
              Max. Uses
            </Label>
            <Value>
              {max_uses === undefined ? (
                `Unlimited`
              ) : (
                <>
                  {`${max_uses}`}
                  <InlineIcon perk={'unlimited_spells'} />
                  <YesNo yes={Boolean(never_unlimited)} />
                </>
              )}
            </Value>
            <Label>Beta</Label>
            <YesNo yes={Boolean(beta)} />
            {spawn_requires_flag !== undefined && (
              <>
                <Label>Unlock</Label>
                <Value>{getUnlockName(spawn_requires_flag)}</Value>
              </>
            )}
            <Label>Friendly-Fire</Label>
            <Value>--</Value>
            <Label>Piercing</Label>
            <Value>--</Value>
            <Label>Penetrating</Label>
            <Value>--</Value>
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
