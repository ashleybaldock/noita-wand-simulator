import styled from 'styled-components';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 10;
`;

const ConfigDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ExportOptions = () => {
  // const copy = (e) => {
  //   e.target.querySelector('input').focus();
  //   e.target.querySelector('input').select();
  //   document.execCommand('copy');
  // };

  return (
    <MainDiv>
      <ConfigDiv>
        <label
          // onClick={(evt) => copy(evt)}
          data-toCopy="${svgToCSSBackground(svg.outerHTML)}"
        >
          <input type="text" />
          CSS
        </label>
      </ConfigDiv>
    </MainDiv>
  );
};
