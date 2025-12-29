import styled from 'styled-components';
import { Unchanged } from './';
import { isNotNullOrUndefined } from '../../util';

const Size = styled.div``;

const Sizer = styled.div`
  color: transparent;
  visibility: hidden;
  display: grid;

  & ${Size} {
    grid-column: 1;
    grid-row: 1;
  }
`;

const Overlay = styled.div<{ $warning?: boolean; $disabled?: boolean }>`
  position: absolute;
  text-decoration: inherit;
  ${({ $warning }) =>
    $warning
      ? `
    color: var(--color-value-warning);
    background-color: red;
    &::before {
      content: '';
    }
    `
      : ''}
  ${({ $disabled }) =>
    $disabled
      ? `
    color: var(--color-value-disabled);
    `
      : ''}
`;

const Combiner = styled.div`
  position: relative;
  display: grid;
  place-items: center end;
`;
export const YesNo = styled(
  ({
    yes,
    $disabled = false,
    className,
    warnIf,
    customYes = <>{'Yes'}</>,
    customNo = <>{'No'}</>,
    customMaybe = <Unchanged />,
  }: {
    yes?: boolean;
    $disabled?: boolean;
    className?: string;
    warnIf?: 'yes' | 'no';
    customYes?: JSX.Element;
    customNo?: JSX.Element;
    customMaybe?: JSX.Element;
  }) => {
    return (
      <Combiner data-name="YesNo" className={className}>
        <Sizer>
          <Size>{customYes}</Size>
          <Size>{customNo}</Size>
          <Size>{customMaybe}</Size>
        </Sizer>
        <Overlay
          $disabled={$disabled}
          $warning={
            (warnIf === 'yes' && yes === true) ||
            (warnIf === 'no' && yes === false)
          }
        >
          {isNotNullOrUndefined(yes)
            ? yes
              ? customYes
              : customNo
            : customMaybe}
        </Overlay>
      </Combiner>
    );
  },
)``;

export const YesOr = styled(
  ({
    yes,
    className,
    children,
  }: React.PropsWithChildren<{ yes: boolean; className?: string }>) =>
    yes ? <span className={className}>`Yes`</span> : <>{children}</>,
)``;
