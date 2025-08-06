import { Search } from '../Search';
import { SectionToolbar } from '../SectionToolbar';
import { ResetButton, UndoButton, RedoButton } from '../buttons';

export const WandBuilderToolbar = () => {
  return (
    <SectionToolbar data-name="WandBuilderToolbar" title={'Wand Editor'}>
      <UndoButton />
      <RedoButton />
      <ResetButton />
      {/* <LoadButton /> */}
      <Search />
    </SectionToolbar>
  );
};
