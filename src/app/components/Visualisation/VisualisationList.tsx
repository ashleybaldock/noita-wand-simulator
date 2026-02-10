import { useRef } from 'react';
import styled from 'styled-components';
import { useConfig, useLatestResult } from '../../redux';
import { SaveImageButton, ScrollWrapper } from '../generic';
import { ActionCallSequenceCastResult } from './ActionSequence';
import { ActionTreeCastResult } from './ActionTree';
import { CastList } from './CastList';
import { SimulationStatus } from '../SimulationStatus';
import { SectionToolbar } from '../SectionToolbar';
import { ActionTreeKey } from './ActionTree/ActionTreeKey';

const ParentDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
`;

// list of several CastResults, generally from clicking/holding until reload, but also for one click

/**
 * Sequence of simulated wand Casts
 */
export const VisualisationList = () => {
  const actionsCalledRef = useRef<HTMLDivElement>(null);
  const actionCallTreeRef = useRef<HTMLDivElement>(null);

  const { showActionTree } = useConfig();

  // const spellIds = useSpellSequence();
  // TODO This can be a custom hook
  // const spells = useMemo(
  //   () =>
  //     spellIds.flatMap((id) =>
  //       isNotNullOrUndefined(id) && isValidActionId(id)
  //         ? getSpellByActionId(id)
  //         : [],
  //     ),
  //   [spellIds],
  // );

  // const spellsWithUses = useMemo(() => {
  //   if (infiniteSpells) {
  //     return spells;
  //   }
  //   return spells.map((spell) => {
  //     if (spell.max_uses && (spell.never_unlimited || !unlimitedSpells)) {
  //       return { ...spell, uses_remaining: 0 };
  //     } else {
  //       return spell;
  //     }
  //   });
  // }, [infiniteSpells, unlimitedSpells, spells]);

  const { casts } = useLatestResult();

  return (
    <ParentDiv>
      <SimulationStatus />
      <CastList />
      {showActionTree && (
        <>
          <SectionToolbar title={'Simulation: Action Call Tree'}>
            <SaveImageButton
              name={'Action Call Tree'}
              targetRef={actionCallTreeRef}
              fileName={'action_call_tree'}
              enabled={casts.length > 0}
            />
            {/* <ShowKeyButton/> */}
          </SectionToolbar>
          <ScrollWrapper>
            <SectionDiv ref={actionCallTreeRef} className={'saveImageRoot'}>
              {casts.map((cast, index) => (
                <ActionTreeCastResult key={index} cast={cast} />
              ))}
            </SectionDiv>
          </ScrollWrapper>
          <ActionTreeKey />
        </>
      )}
      <SectionToolbar title={'Simulation: Action Call Sequence'}>
        <SaveImageButton
          targetRef={actionsCalledRef}
          name={'Action Call Sequence'}
          fileName={'action_call_sequence'}
          enabled={casts.length > 0}
        />
      </SectionToolbar>
      <ScrollWrapper>
        <SectionDiv ref={actionsCalledRef} className={'saveImageRoot'}>
          {casts.map((shot, index) => (
            <ActionCallSequenceCastResult key={index} cast={shot} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </ParentDiv>
  );
};

// const shotsNoDivides = useMemo(() => {
//   if (!showDivides) {
//     return shots.map((s) => ({
//       ...s,
//       calledActions: s.actionCallGroups.filter(
//         (ac) => !ac.spell.id.startsWith('DIVIDE'),
//       ),
//     }));
//   } else {
//     return shots;
//   }
// }, [showDivides, shots]);

// const shotsNoGreekSpells = useMemo(() => {
//   if (!showGreekSpells) {
//     return shots.map((s) => ({
//       ...s,
//       calledActions: s.actionCallGroups.filter(
//         ({ spell }) => isValidActionId(spell.id) && isGreekActionId(spell.id),
//       ),
//     }));
//   } else {
//     return shots;
//   }
// }, [showGreekSpells, shots]);

// const shotsNoDirectActionCalls = useMemo(() => {
//   if (!showDirectActionCalls) {
//     return shots.map((s) => ({
//       ...s,
//       calledActions: s.actionCallGroups.filter(
//         (ac) => ac.source !== 'action',
//       ),
//     }));
//   } else {
//     return shots;
//   }
// }, [showDirectActionCalls, shots]);
