import { useConfigToggle } from '../../../redux';
import {
  SubSectionContent,
  SubSectionDiv,
  SubSectionTitle,
  WrappedYesNoToggle,
} from '../Components';

export const LimitsConfigSection = () => {
  const [unlimitedSpells, , , handleUnlimitedSpellsToggle] =
    useConfigToggle('unlimitedSpells');
  const [infiniteSpells, , , handleInfiniteSpellsToggle] =
    useConfigToggle('infiniteSpells');

  return (
    <SubSectionDiv data-section="limits">
      <SubSectionTitle>
        <span>Limits</span>
      </SubSectionTitle>
      <SubSectionContent>
        <WrappedYesNoToggle
          checked={unlimitedSpells}
          onChange={handleUnlimitedSpellsToggle}
        >
          <span>Unlimited Spells Perk</span>
        </WrappedYesNoToggle>
        <WrappedYesNoToggle
          checked={infiniteSpells}
          onChange={handleInfiniteSpellsToggle}
        >
          <span>∞ Spells (Ignore usage limits)</span>
        </WrappedYesNoToggle>
      </SubSectionContent>
    </SubSectionDiv>
  );
};
