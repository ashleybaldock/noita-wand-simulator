import type { LegacyRef } from 'react';
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { isNotNullOrUndefined } from '../../util';
import { clickWand } from '../../calc/eval/clickWand';
import { condenseActionsAndProjectiles } from '../../calc/grouping/condense';
import { isValidActionId, isGreekActionId } from '../../calc/actionId';
import { getSpellById } from '../../calc/spells';
import { useConfig, useSpellSequence, useWand } from '../../redux';
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

/**
 * Sequence of simulated wand shots
 */
export const VisualisationList = () => {
  const wand = useWand();
  const spellIds = useSpellSequence();
  const [simulationRunning, setSimulationRunning] = useState(false);
  const actionsCalledRef = useRef<HTMLDivElement>();
  const actionCallTreeRef = useRef<HTMLDivElement>();

  const {
    condenseShots,
    unlimitedSpells,
    infiniteSpells,
    showDivides,
    showGreekSpells,
    showDirectActionCalls,
    endSimulationOnRefresh,
    showActionTree,
    'random.worldSeed': worldSeed,
    'random.frameNumber': frameNumber,
    'requirements.enemies': req_enemies,
    'requirements.projectiles': req_projectiles,
    'requirements.hp': req_hp,
    'requirements.half': req_half,
  } = useConfig();

  // TODO This can be a custom hook
  const spells = useMemo(
    () =>
      spellIds.flatMap((id) =>
        isNotNullOrUndefined(id) && isValidActionId(id) ? getSpellById(id) : [],
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
    recharge: totalRechargeTime,
    endReason,
    elapsedTime,
  } = useMemo(() => {
    setSimulationRunning(true);
    const result = clickWand(wand, spellsWithUses, {
      req_enemies: req_enemies,
      req_projectiles: req_projectiles,
      req_hp: req_hp,
      req_half: req_half,
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
    req_enemies,
    req_projectiles,
    req_hp,
    req_half,
    spellsWithUses,
    wand,
    worldSeed,
  ]);

  const shotsNoDivides = useMemo(() => {
    if (!showDivides) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.actionCallGroups.filter(
          (ac) => !ac.spell.id.startsWith('DIVIDE'),
        ),
      }));
    } else {
      return shots;
    }
  }, [showDivides, shots]);

  const shotsNoGreekSpells = useMemo(() => {
    if (!showGreekSpells) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.actionCallGroups.filter(
          ({ spell }) => isValidActionId(spell.id) && isGreekActionId(spell.id),
        ),
      }));
    } else {
      return shots;
    }
  }, [showGreekSpells, shots]);

  const shotsNoDirectActionCalls = useMemo(() => {
    if (!showDirectActionCalls) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.actionCallGroups.filter(
          (ac) => ac.source !== 'action',
        ),
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
