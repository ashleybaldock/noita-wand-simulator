import styled from 'styled-components';
import { Button } from '../generic/Button';
import { copyToClipboard } from '../../util';
import {
  useWikiExampleExport,
  useWikiExportWand,
  useWikiSequenceExport,
} from '../../redux';

const WikiTemplate = styled.span`
  &::before {
    content: '{{';
    letter-spacing: 0.2ch;
  }
  &::after {
    content: '}}';
    letter-spacing: 0.2ch;
    padding-left: 0.2ch;
  }
`;

const _ExportWikiButton = () => {
  const wikiTemplateWand = useWikiExportWand();
  const wikiTemplateSeq = useWikiSequenceExport();
  const wikiTemplateExample = useWikiExampleExport();

  const onCopySuccess = () => {};
  const onCopyFailure = () => {};

  return (
    <>
      <Button
        hotkeys={{ hotkeys: 'ctrl+e', position: 'bottom' }}
        minimal
        imgAfter
        tip={{ kind: 'uihint', id: 'copywiki' }}
        onClick={() =>
          copyToClipboard(wikiTemplateWand)
            .then(onCopySuccess)
            .catch(onCopyFailure)
        }
        icon={'icon.copy'}
      >
        <span>
          {'Copy as Wiki '}
          <WikiTemplate>{'Wand2'}</WikiTemplate>
        </span>
      </Button>
      <Button
        hotkeys={{ hotkeys: 'ctrl+shift+e', position: 'bottom' }}
        minimal
        imgAfter
        tip={{ kind: 'uihint', id: 'copywikiseq' }}
        onClick={() =>
          copyToClipboard(wikiTemplateSeq)
            .then(onCopySuccess)
            .catch(onCopyFailure)
        }
        icon={'icon.copy'}
      >
        <span>
          {'Copy as Wiki '}
          <WikiTemplate>{'SpellSequence'}</WikiTemplate>
        </span>
      </Button>
      <Button // hotkeys={{ hotkeys: 'ctrl+e', position: 'bottom' }}
        minimal
        imgAfter
        tip={{ kind: 'uihint', id: 'copywikiexample' }}
        onClick={() =>
          copyToClipboard(wikiTemplateExample)
            .then(onCopySuccess)
            .catch(onCopyFailure)
        }
        icon={'icon.copy'}
      >
        <span>
          {'Copy as Wiki '}
          <WikiTemplate>{'Example'}</WikiTemplate>
        </span>
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
