import { LegacyRef, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { isNotNullOrUndefined } from '../../util';
import { clickWand } from '../../calc/eval/clickWand';
import { condenseActionsAndProjectiles } from '../../calc/grouping/condense';
import { isValidActionId, isGreekActionId } from '../../calc/actionId';
import { getSpellById } from '../../calc/spells';
import { useConfig, useWandState } from '../../redux';
import { SaveImageButton, ScrollWrapper } from '../generic';
import { ActionCalledShotResult } from './ActionSequence';
import { ActionTreeShotResult } from './ActionTree';
import { SectionHeader } from '../SectionHeader';
import { ShotList } from './ProjectileTree';
import { SimulationStatus } from '../SimulationStatus';

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
export const VisualisationList = ({
  condenseShots,
  unlimitedSpells,
  infiniteSpells,
  showDivides,
  showGreekSpells,
  showDirectActionCalls,
}: {
  condenseShots: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
  showDivides: boolean;
  showGreekSpells: boolean;
  showDirectActionCalls: boolean;
}) => {
  const { wand, spellIds } = useWandState();

  const config = useConfig();
  const {
    random: { worldSeed, frameNumber },
    endSimulationOnRefresh,
    showActionTree,
    requirements: requirementConfig,
  } = config;

  const actionsCalledRef = useRef<HTMLDivElement>();
  const actionCallTreeRef = useRef<HTMLDivElement>();

  // TODO This can be a custom hook
  const spells = useMemo(
    () =>
      spellIds.flatMap((id) =>
        isNotNullOrUndefined(id) && isValidActionId(id) ? getSpellById(id) : [],
      ),
    [spellIds],
  );

  const spellActionsWithUses = useMemo(() => {
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

  const [simulationRunning, setSimulationRunning] = useState(false);

  let {
    shots,
    recharge: totalRechargeTime,
    endReason,
    elapsedTime,
  } = useMemo(() => {
    setSimulationRunning(true);
    const result = clickWand(wand, spellActionsWithUses, {
      req_enemies: requirementConfig.enemies,
      req_projectiles: requirementConfig.projectiles,
      req_hp: requirementConfig.hp,
      req_half: requirementConfig.half,
      rng_frameNumber: frameNumber,
      rng_worldSeed: worldSeed,
      wand_available_mana: wand.mana_max,
      wand_cast_delay: wand.cast_delay,
      fireUntil: endSimulationOnRefresh ? 'refresh' : 'reload',
    });
    setSimulationRunning(false);
    return result;
  }, [
    endSimulationOnRefresh,
    frameNumber,
    requirementConfig,
    spellActionsWithUses,
    wand,
    worldSeed,
  ]);

  shots = useMemo(() => {
    if (!showDivides) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => !ac.spell.id.startsWith('DIVIDE'),
        ),
      }));
    } else {
      return shots;
    }
  }, [showDivides, shots]);

  shots = useMemo(() => {
    if (!showGreekSpells) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          ({ spell }) => isValidActionId(spell.id) && isGreekActionId(spell.id),
        ),
      }));
    } else {
      return shots;
    }
  }, [showGreekSpells, shots]);

  shots = useMemo(() => {
    if (!showDirectActionCalls) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter((ac) => ac.source !== 'action'),
      }));
    } else {
      return shots;
    }
  }, [showDirectActionCalls, shots]);

  const groupedShots = useMemo(() => {
    if (condenseShots) {
      return shots.map(condenseActionsAndProjectiles);
    } else {
      return shots;
    }
  }, [condenseShots, shots]);

  return (
    <ParentDiv>
      <SimulationStatus
        simulationRunning={simulationRunning}
        lastStopReason={endReason}
        lastEndCondition={'oneshot'}
        elapsedTime={elapsedTime}
      />
      <ShotList
        simulationRunning={simulationRunning}
        endReason={endReason}
        shots={groupedShots}
        totalRechargeTime={totalRechargeTime}
      />
      {showActionTree && (
        <>
          <SectionHeader title={'Simulation: Action Call Tree'} />
          <ScrollWrapper>
            <SectionDiv
              ref={actionCallTreeRef as LegacyRef<HTMLDivElement>}
              className={'saveImageRoot'}
            >
              <SaveImageButton
                targetRef={actionCallTreeRef}
                fileName={'action_tree'}
                enabled={groupedShots.length > 0}
              />
              {groupedShots.map((shot, index) => (
                <ActionTreeShotResult key={index} shot={shot} />
              ))}
            </SectionDiv>
          </ScrollWrapper>
        </>
      )}
      <SectionHeader title={'Simulation: Action Call Sequence'} />
      <ScrollWrapper>
        <SectionDiv
          ref={actionsCalledRef as LegacyRef<HTMLDivElement>}
          className={'saveImageRoot'}
        >
          <SaveImageButton
            targetRef={actionsCalledRef}
            fileName={'actions_called'}
            enabled={groupedShots.length > 0}
          />
          {groupedShots.map((shot, index) => (
            <ActionCalledShotResult key={index} shot={shot} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
    </ParentDiv>
  );
};
