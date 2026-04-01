import styled from 'styled-components';

export const WandStatName = styled.div`
  text-align: left;
  flex: 0 1 auto;
  white-space: nowrap;

  width: 100%;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    border-bottom: 3px dotted #222222;
    height: 0.7em;
    display: inline-block;
    flex: 1 1 auto;
  }
`;
