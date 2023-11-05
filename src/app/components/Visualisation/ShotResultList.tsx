import React, { useMemo, useRef } from 'react';
import styled from 'styled-components/macro';
import { isNotNullOrUndefined } from '../../util';
import { clickWand } from '../../calc/eval/clickWand';
import { condenseActionsAndProjectiles } from '../../calc/grouping/condense';
import { isValidActionId, isGreekActionId } from '../../calc/actionId';
import { getSpellById } from '../../calc/spells';
import { useWandState } from '../../redux';
import { selectConfig } from '../../redux/configSlice';
import { useAppSelector } from '../../redux/hooks';
import { SaveImageButton, ScrollWrapper } from '../generic';
import { IterationLimitWarning } from './IterationLimitWarning';
import { ProjectileTreeShotResult } from './ProjectileTree';
import { ActionCalledShotResult } from './ActionSequence';
import { ActionTreeShotResult } from './ActionTree';
import { SectionHeader } from '../SectionHeader';
import { ShotMetadata } from './ShotMetadata';

const ParentDiv = styled.div``;

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
`;

// list of several ShotResults, generally from clicking/holding until reload, but also for one click
export const ShotResultList = ({
  pauseCalculations,
  condenseShots,
  unlimitedSpells,
  infiniteSpells,
  showDivides,
  showGreekSpells,
  showDirectActionCalls,
}: {
  pauseCalculations: boolean;
  condenseShots: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
  showDivides: boolean;
  showGreekSpells: boolean;
  showDirectActionCalls: boolean;
}) => {
  const { wand, spellIds } = useWandState();

  const { config } = useAppSelector(selectConfig);

  const projectilesRef = useRef<HTMLDivElement>();
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

  let [shots, reloadTime, hitIterationLimit] = useMemo(
    () =>
      clickWand(
        wand,
        spellActionsWithUses,
        wand.mana_max,
        wand.cast_delay,
        true,
        config.endSimulationOnRefresh,
        config.requirements,
      ),
    [
      config.endSimulationOnRefresh,
      config.requirements,
      spellActionsWithUses,
      wand,
    ],
  );

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
      <SectionHeader title={'Simulation: Projectiles'} />
      <ScrollWrapper>
        <SectionDiv ref={projectilesRef as any} className={'saveImageRoot'}>
          <SaveImageButton
            targetRef={projectilesRef}
            fileName={'projectiles'}
            enabled={groupedShots.length > 0}
          />
          <IterationLimitWarning hitIterationLimit={hitIterationLimit} />
          {groupedShots.length > 0 && (
            <ShotMetadata rechargeDelay={reloadTime} />
          )}
          {groupedShots.map((shot, index) => (
            <ProjectileTreeShotResult shot={shot} key={index} indent={false} />
          ))}
        </SectionDiv>
      </ScrollWrapper>
      <SectionHeader title={'Simulation: Action Call Sequence'} />
      <ScrollWrapper>
        <SectionDiv ref={actionsCalledRef as any} className={'saveImageRoot'}>
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
      {config.showActionTree && (
        <>
          <SectionHeader title={'Simulation: Action Call Tree'} />
          <ScrollWrapper>
            <SectionDiv
              ref={actionCallTreeRef as any}
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
    </ParentDiv>
  );
};
