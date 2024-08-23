import styled from 'styled-components';
import { useWikiExportWand } from '../../redux';

const _ExportAs = ({ className }: { className?: string }) => {
  const wikiTemplate = useWikiExportWand();
  return (
    <div className={className}>
      <div>Wiki Wand Template</div>
      <div>Click to copy to clipboard</div>
      <div>
        <pre>{wikiTemplate}</pre>
      </div>
    </div>
  );
};

export const ExportAs = styled(_ExportAs)``;
