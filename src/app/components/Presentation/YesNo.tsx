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

const Overlay = styled.div<{ $warning?: boolean }>`
  position: absolute;
  ${({ $warning }) =>
    $warning &&
    `
    color: var(--color-value-warning);
    background-color: red;
    &::before {
      content: '';
    }
    `}
`;

const Combiner = styled.div`
  position: relative;
  display: grid;
  place-items: center center;
`;
export const YesNo = styled(({ yes, className, warnIf, customYes = <>
      {'Yes'}
    </>, customNo = <>
      {'No'}
    </>, customMaybe = <Unchanged /> }: { yes?: boolean; className?: string; warnIf?: 'yes' | 'no'; customYes?: JSX.Element; customNo?: JSX.Element; customMaybe?: JSX.Element }) => {
  return (
    <Combiner className={className}>
      <Sizer>
        <Size>{customYes}</Size>
        <Size>{customNo}</Size>
        <Size>{customMaybe}</Size>
      </Sizer>
      <Overlay
        $warning={
          (warnIf === 'yes' && yes === true) ||
          (warnIf === 'no' && yes === false)
        }
      >
        {isNotNullOrUndefined(yes) ? (yes ? customYes : customNo) : customMaybe}
      </Overlay>
    </Combiner>
  );
})``;

export const YesOr = styled(
  ({
    yes,
    className,
    children,
  }: React.PropsWithChildren<{ yes: boolean; className?: string }>) =>
    yes ? <span className={className}>`Yes`</span> : <>{children}</>,
)``;
