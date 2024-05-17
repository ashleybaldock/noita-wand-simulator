import styled from 'styled-components';
import type { Preset, PresetGroup } from '../../redux/Wand/preset';
import { isPresetGroup, isSinglePreset } from '../../redux/Wand/preset';
import { Button } from '../generic';
import { setWand, useAppDispatch, usePresets, useUIToggle } from '../../redux';
import { useCallback } from 'react';

const PresetGroupNameDiv = styled.div`
  font-weight: bold;
  letter-spacing: 0.01em;
  position: sticky;
  padding: 1.3em 0 0.3em 0;
  letter-spacing: 0.01em;
  top: -0.4em;
  background-color: var(--color-modal-bg);
  z-index: var(--zindex-modal-subtitle);

  @media screen and (max-width: 500px) {
    top: var(--modal-header-height);
  }
`;

const PresetGroupList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;
`;

const PresetListSection = styled.li`
  list-style-type: none;
  padding-left: 1em;
  position: relative;
`;

const PresetGroupListItem = styled.li`
  list-style-type: none;
  margin-left: 1em;
  padding: 0 1em 0.4em 1em;
  position: relative;

  li {
    margin-left: 0;
  }
`;
const PresetButtonListItem = styled.li`
  margin-left: 1em;
  padding-left: 1em;
  position: relative;

  &:hover::before {
  }

  &::before {
    --thickness: 2px;
    --color: var(--color-base);
    --thalf: calc(var(--thickness) / 2);
    --height: calc(100% - var(--thalf));
    --width: calc(100% - var(--thalf));
    --width: 2em;

    content: '';
    pointer-events: none;
    position: absolute;
    top: calc((var(--height) / -2) - var(--thalf));
    left: calc(var(--thickness) * -1);
    border-left: var(--thickness) solid var(--color);
    border-bottom: var(--thickness) solid var(--color);
    border-radius: 0 0 0 8px;
    height: var(--height);
    width: var(--width);
  }
`;

const StyledPresetButton = styled(Button)`
  text-align: left;
  width: 90%;
  padding-top: 0.4em;
  padding-bottom: 0.2em;
  margin-top: 0.2em;
  margin-bottom: 0.2em;
  border-radius: 2px 8px;
`;

const PresetButton = ({
  preset,
  className = '',
}: {
  preset: Preset;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const [, setModalVisible] = useUIToggle('showWandPresets');

  const handleSelect = useCallback(
    (preset: Preset) => {
      dispatch(setWand({ wand: preset.wand, spells: preset.spells }));
      setModalVisible(false);
    },
    [dispatch],
  );

  return (
    <PresetButtonListItem
      data-name="PresetButtonListItem"
      className={className}
    >
      <StyledPresetButton onClick={() => handleSelect(preset)}>
        {preset.name}
      </StyledPresetButton>
    </PresetButtonListItem>
  );
};

const PresetList = ({
  presetGroup,
  prefix = '',
}: {
  presetGroup: PresetGroup;
  prefix: string;
}) => {
  return (
    <>
      <PresetGroupNameDiv>{presetGroup.name}</PresetGroupNameDiv>
      <PresetGroupList data-name="PresetGroupList">
        {presetGroup.presets.map((preset) => {
          if (isPresetGroup(preset)) {
            return (
              <PresetGroupListItem
                key={`${prefix}--${presetGroup.name}--${preset.name}`}
              >
                <PresetList
                  data-name="PresetList"
                  presetGroup={preset}
                  prefix={`${prefix}--${presetGroup.name}`}
                />
              </PresetGroupListItem>
            );
          }
          if (isSinglePreset(preset)) {
            return (
              <PresetButton
                preset={preset}
                key={`${prefix}--${presetGroup.name}--${preset.name}`}
              />
            );
          }
        })}
      </PresetGroupList>
    </>
  );
};
const Footer = styled.div`
  height: 6em;
`;
export const WandPresetMenu = () => {
  const presets = usePresets();

  return (
    <PresetGroupList>
      {presets.map((presetGroup, index) => (
        <PresetListSection key={index}>
          <PresetList presetGroup={presetGroup} prefix={'presets--'} />
        </PresetListSection>
      ))}
      <Footer />
    </PresetGroupList>
  );
};
