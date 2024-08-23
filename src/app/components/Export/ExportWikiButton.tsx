import styled from 'styled-components';
import { Button } from '../generic/Button';
import { copyToClipboard } from '../../util';
import { useWikiExportWand, useWikiSequenceExport } from '../../redux';

const _ExportWikiButton = () => {
  const wikiTemplateWand = useWikiExportWand();
  const wikiTemplateSeq = useWikiSequenceExport();

  const onCopySuccess = () => {};
  const onCopyFailure = () => {};

  return (
    <>
      <Button
        hotkeys={'e'}
        minimal
        tip={{ kind: 'uihint', id: 'copywiki' }}
        onClick={() =>
          copyToClipboard(wikiTemplateWand)
            .then(onCopySuccess)
            .catch(onCopyFailure)
        }
        icon={'icon.copy'}
      >
        <span>WIKI:Wand</span>
      </Button>
      <Button
        hotkeys={'shift+e'}
        minimal
        tip={{ kind: 'uihint', id: 'copywikiseq' }}
        onClick={() =>
          copyToClipboard(wikiTemplateSeq)
            .then(onCopySuccess)
            .catch(onCopyFailure)
        }
        icon={'icon.copy'}
      >
        <span>WIKI:SpellSequence</span>
      </Button>
    </>
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
