import { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { isNotNullOrUndefined } from '../../util';
import { isValidActionId } from '../../calc/actionId';
import { getSpellByActionId } from '../../calc/spells';
import {
  useConfig,
  useLatestResult,
  useSimulationStatus,
  useSpellSequence,
} from '../../redux';
import { SaveImageButton, ScrollWrapper } from '../generic';
import { ActionCalledShotResult } from './ActionSequence';
import { ActionTreeShotResult } from './ActionTree';
import { ShotList } from './ShotList';
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

// list of several ShotResults, generally from clicking/holding until reload, but also for one click

/**
 * Sequence of simulated wand shots
 */
export const VisualisationList = () => {
  const spellIds = useSpellSequence();
  const [simulationRunning] = useSimulationStatus();
  const actionsCalledRef = useRef<HTMLDivElement>(null);
  const actionCallTreeRef = useRef<HTMLDivElement>(null);

  const { unlimitedSpells, infiniteSpells, showActionTree } = useConfig();

  // TODO This can be a custom hook
  const spells = useMemo(
    () =>
      spellIds.flatMap((id) =>
        isNotNullOrUndefined(id) && isValidActionId(id)
          ? getSpellByActionId(id)
          : [],
      ),
    [spellIds],
  );

  const spellsWithUses = useMemo(() => {
    if (infiniteSpells) {
      return spells;
    }
    return spells.map((spell) => {
      if (spell.max_uses && (spell.never_unlimited || !unlimitedSpells)) {
        return { ...spell, uses_remaining: 0 };
      } else {
        return spell;
      }
    });
  }, [infiniteSpells, unlimitedSpells, spells]);

  const {
    shots,
    reloadTime: totalRechargeTime,
    endConditions,
    elapsedTime,
  } = useLatestResult();

  return (
    <ParentDiv>
      <SimulationStatus />
      <ShotList
        simulationRunning={simulationRunning}
        endReasons={endConditions}
        shots={shots}
        totalRechargeTime={totalRechargeTime}
      />
      {showActionTree && (
        <>
          <SectionToolbar title={'Simulation: Action Call Tree'}>
            <SaveImageButton
              name={'Action Call Tree'}
              targetRef={actionCallTreeRef}
              fileName={'action_call_tree'}
              enabled={shots.length > 0}
            />
            {/* <ShowKeyButton/> */}
          </SectionToolbar>
          <ActionTreeKey />
          <ScrollWrapper>
            <SectionDiv ref={actionCallTreeRef} className={'saveImageRoot'}>
              {shots.map((shot, index) => (
                <ActionTreeShotResult key={index} shot={shot} />
              ))}
            </SectionDiv>
          </ScrollWrapper>
        </>
      )}
      <SectionToolbar title={'Simulation: Action Call Sequence'}>
        <SaveImageButton
          targetRef={actionsCalledRef}
          name={'Action Call Sequence'}
          fileName={'action_call_sequence'}
          enabled={shots.length > 0}
        />
      </SectionToolbar>
      <ScrollWrapper>
        <SectionDiv ref={actionsCalledRef} className={'saveImageRoot'}>
          {shots.map((shot, index) => (
            <ActionCalledShotResult key={index} shot={shot} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </ParentDiv>
  );
};

// TODO remove/reimplement if needed
// const {
//   shots,
//   reloadTime: totalRechargeTime,
//   endConditions,
//   elapsedTime,
// } = useMemo(() => {
//   setSimulationRunning(true);
//   const result = clickWand(wand, spellsWithUses, {
//     req_enemies: req_enemies,
//     req_projectiles: req_projectiles,
//     req_hp: req_hp,
//     req_half: req_half,
//     rng_frameNumber: frameNumber,
//     rng_worldSeed: worldSeed,
//     wand_available_mana: wand.mana_max,
//     wand_cast_delay: wand.cast_delay,
//     endSimulationOnShotCount,
//     endSimulationOnReloadCount,
//     endSimulationOnRefreshCount,
//     endSimulationOnRepeatCount,
//     limitSimulationIterations,
//     limitSimulationDuration,
//   });
//   setSimulationRunning(false);
//   return result;
// }, [
//   endSimulationOnShotCount,
//   endSimulationOnReloadCount,
//   endSimulationOnRefreshCount,
//   endSimulationOnRepeatCount,
//   limitSimulationIterations,
//   limitSimulationDuration,
//   frameNumber,
//   req_enemies,
//   req_projectiles,
//   req_hp,
//   req_half,
//   spellsWithUses,
//   wand,
//   worldSeed,
// ]);

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
