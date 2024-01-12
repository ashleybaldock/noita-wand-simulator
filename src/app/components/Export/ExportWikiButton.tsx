import styled from 'styled-components';
import { useWikiExport } from '../../redux';
import { Button } from '../generic/Button';
import { copyToClipboard } from '../../util';

const _ExportWikiButton = () => {
  const wikiTemplate = useWikiExport();

  const onCopySuccess = () => {};
  const onCopyFailure = () => {};

  return (
    <Button
      hotkeys={'e'}
      minimal
      tooltipId="tooltip-actionhint"
      tooltipActionHintId="actionhint-copywiki"
      onClick={() =>
        copyToClipboard(wikiTemplate).then(onCopySuccess).catch(onCopyFailure)
      }
      imgDataUrl={
        'data:image/svg+xml,%3Csvg style=%22fill: %23ffffff;%22 data-name=%22copy%22 xmlns=%22http://www.w3.org/2000/svg%22 height=%221em%22 viewBox=%220 0 448 512%22%3E%3C!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --%3E%3Cpath d=%22M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z%22%3E%3C/path%3E%3C/svg%3E'
      }
    >
      <span>WIKI</span>
    </Button>
  );
};

export const ExportWikiButton = styled(_ExportWikiButton)`
  display: inline flex;
  align-items: end;
  cursor: pointer;
  vertical-align: baseline;

  margin: 0;

  color: #ffffff;

  & span {
    font-size: 0.7em;
  }
`;
