import styled from 'styled-components';
import { useWikiExport } from '../../redux';

const _ExportAs = ({ className }: { className?: string }) => {
  const wikiTemplate = useWikiExport();
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
