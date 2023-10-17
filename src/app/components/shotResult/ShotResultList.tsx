import { isValidActionId, isGreekActionId } from '../../calc/actionId';
import { useAppSelector } from '../../redux/hooks';
import { ProjectileTreeShotResult } from './ProjectileTreeShotResult';
import styled from 'styled-components/macro';
import { ActionCalledShotResult } from './ActionCalledShotResult';
import React, { useMemo, useRef } from 'react';
import { SectionHeader } from '../SectionHeader';
import { clickWand } from '../../calc/eval/clickWand';
import { selectConfig } from '../../redux/configSlice';
import { ActionTreeShotResult } from './ActionTreeShotResult';
import { condenseActionsAndProjectiles } from '../../calc/grouping/condense';
import { ShotMetadata } from './ShotMetadata';
import { SaveImageButton, ScrollWrapper } from '../generic';
import { IterationLimitWarning } from './IterationLimitWarning';
import { useWandSlice } from '../../redux';
import { isNotNullOrUndefined } from '../../util';
import { getSpellById } from '../../calc/spells';

const ParentDiv = styled.div``;

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: fit-content;
`;

const StyledHr = styled.hr`
  width: 98%;
  border-color: #666;
  margin: 2px 0;
`;

type Props = {
  pauseCalculations: boolean;
  condenseShots: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
  showDivides: boolean;
  showGreekSpells: boolean;
  showDirectActionCalls: boolean;
};

// list of several ShotResults, generally from clicking/holding until reload, but also for one click
export function ShotResultList({
  pauseCalculations,
  condenseShots,
  unlimitedSpells,
  infiniteSpells,
  showDivides,
  showGreekSpells,
  showDirectActionCalls,
}: Props) {
  const { wand: wandSlice } = useWandSlice();
  const { spellIds, wand } = wandSlice.present;

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
          {groupedShots.length > 0 && (
            <ShotMetadata rechargeDelay={reloadTime} />
          )}
          {groupedShots.map((shot, index) => (
            <React.Fragment key={index}>
              {index > 0 && <StyledHr />}
              <ProjectileTreeShotResult shot={shot} indent={false} />
            </React.Fragment>
          ))}
          <IterationLimitWarning hitIterationLimit={hitIterationLimit} />
        </SectionDiv>
      </ScrollWrapper>
      <SectionHeader title={'Simulation: Actions Called'} />
      <ScrollWrapper>
        <SectionDiv ref={actionsCalledRef as any} className={'saveImageRoot'}>
          {groupedShots.map((shot, index) => (
            <React.Fragment key={index}>
              {index > 0 && <StyledHr />}
              <ActionCalledShotResult key={index} shot={shot} />
            </React.Fragment>
          ))}
          <SaveImageButton
            targetRef={actionsCalledRef}
            fileName={'actions_called'}
            enabled={groupedShots.length > 0}
          />
        </SectionDiv>
      </ScrollWrapper>
      {config.showActionTree && (
        <>
          <ScrollWrapper>
            <SectionDiv
              ref={actionCallTreeRef as any}
              className={'saveImageRoot'}
            >
              {groupedShots.map((shot, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <StyledHr />}
                  <ActionTreeShotResult key={index} shot={shot} />
                </React.Fragment>
              ))}
              <SaveImageButton
                targetRef={actionCallTreeRef}
                fileName={'action_tree'}
                enabled={groupedShots.length > 0}
              />
              <SaveImageButton
                targetRef={projectilesRef}
                fileName={'projectiles'}
                enabled={groupedShots.length > 0}
              />
            </SectionDiv>
          </ScrollWrapper>
        </>
      )}
    </ParentDiv>
  );
}
