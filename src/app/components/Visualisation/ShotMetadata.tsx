import styled from 'styled-components/macro';
import { StopReason } from '../../calc/eval/clickWand';
import { round } from '../../util/util';

const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  background-color: #222;
  color: #fff;
  font-weight: bold;
  min-width: 230px;
  border: 1px solid black;
  border-bottom: none;
  padding: 4px;
  font-family: var(--font-family-noita-default);
`;

const ListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
`;

const Name = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const Value = styled.span`
  text-align: endReasoo lnd eft;
  flex: 0 0 auto;
`;

export const ShotMetadata = ({
  manaDrain,
  castDelay,
  rechargeDelay,
  endReason = 'unknown',
}: {
  manaDrain?: number;
  castDelay?: number;
  rechargeDelay?: number;
  endReason?: StopReason;
}) => {
  return (
    <List>
      {(endReason ?? false) && endReason !== 'unknown' && (
        <ListItem>
          <Name>{`End: ${endReason}`}</Name>
        </ListItem>
      )}
      {(manaDrain ?? false) && (
        <ListItem>
          <Name>{'Σ Mana Drain'}</Name>
          <Value>{round(Number(manaDrain), 0)}</Value>
        </ListItem>
      )}
      {(castDelay ?? false) && (
        <ListItem>
          <Name>{'Σ Cast Delay'}</Name>
          <Value> {round(Math.max(0, Number(castDelay) / 60), 2)}s</Value>
        </ListItem>
      )}
      {(rechargeDelay ?? false) && (
        <ListItem>
          <Name>{'Σ Recharge Delay'}</Name>
          <Value>{round(Math.max(0, Number(rechargeDelay) / 60), 2)}s</Value>
        </ListItem>
      )}
    </List>
  );
};
