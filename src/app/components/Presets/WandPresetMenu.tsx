import styled from 'styled-components';
import type { Preset, PresetGroup } from '../../redux/Wand/preset';
import { isPresetGroup } from '../../redux/Wand/preset';
import { Button } from '../generic';

const PresetGroupNameDiv = styled.div`
  font-weight: bold;
`;

const PresetGroupListDiv = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;

  li:last-child {
    border-left: 2px solid transparent;
  }
`;

const FirstPresetGroupDiv = styled.div``;

const PresetGroupDiv = styled.li`
  border-left: 2px solid var(--color-base);
  margin-left: 1em;
  padding-left: 1em;
  position: relative;

  &:before {
    content: '┗';
    color: var(--color-base);
    position: absolute;
    top: 0;
    left: -9px;
  }

  li {
    margin-left: 0;
  }
`;
const PresetButtonDiv = styled.li`
  border-left: 2px solid var(--color-base);
  margin-left: 1em;
  padding-left: 1em;
  position: relative;

  &:before {
    content: '┗';
    color: var(--color-base);
    position: absolute;
    top: 0;
    left: -9px;
  }
`;

export const WandPresetMenu = ({
  presets,
  onSelect,
}: {
  presets: (Preset | PresetGroup)[];
  onSelect: (p: Preset) => void;
}) => {
  const createPresetList = (
    presetGroup: PresetGroup,
    prefix: string = 'presets--',
    first: boolean = true,
  ) => {
    const content = (
      <>
        {!first && <PresetGroupNameDiv>{presetGroup.name}</PresetGroupNameDiv>}
        <PresetGroupListDiv>
          {presetGroup.presets.map((p, index) => {
            if (isPresetGroup(p)) {
              return createPresetList(
                p,
                `${prefix}--${presetGroup.name}--${p.name}`,
                false,
              );
            } else {
              return (
                <PresetButtonDiv>
                  <Button
                    key={`${prefix}--${presetGroup.name}--${p.name}`}
                    onClick={() => onSelect(p)}
                  >
                    {p.name}
                  </Button>
                </PresetButtonDiv>
              );
            }
          })}
        </PresetGroupListDiv>
      </>
    );

    if (first) {
      return (
        <FirstPresetGroupDiv key={`${prefix}--${presetGroup.name}`}>
          {content}
        </FirstPresetGroupDiv>
      );
    } else {
      return (
        <PresetGroupDiv key={`${prefix}--${presetGroup.name}`}>
          {content}
        </PresetGroupDiv>
      );
    }
  };

  return createPresetList({ name: 'Presets', presets });
};
