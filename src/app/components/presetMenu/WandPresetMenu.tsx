import { Preset, PresetGroup } from '../../types';
import React from 'react';
import styled from 'styled-components/macro';
import { isPresetGroup } from '../../util/util';
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

type Props = {
  presets: (Preset | PresetGroup)[];
  onSelect: (p: Preset) => void;
};

export function WandPresetMenu(props: Props) {
  const { presets, onSelect } = props;

  const createPresetList = (
    presetGroup: PresetGroup,
    first: boolean = true,
  ) => {
    const content = (
      <>
        {!first && <PresetGroupNameDiv>{presetGroup.name}</PresetGroupNameDiv>}
        <PresetGroupListDiv>
          {presetGroup.presets.map((p, index) => {
            if (isPresetGroup(p)) {
              return createPresetList(p, false);
            } else {
              return (
                <PresetButtonDiv>
                  <Button key={p.name} onClick={() => onSelect(p)}>
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
        <FirstPresetGroupDiv key={presetGroup.name}>
          {content}
        </FirstPresetGroupDiv>
      );
    } else {
      return <PresetGroupDiv key={presetGroup.name}>{content}</PresetGroupDiv>;
    }
  };

  return createPresetList({ name: 'Presets', presets });
}
