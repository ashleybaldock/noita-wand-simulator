import { getSpellByActionId } from '../../../calc/spells';
import {
  ActionSourceAnnotation,
  DiscardedAnnotation,
  DontDrawAnnotation,
  DrawAnnotationConsumed,
  DrawAnnotationDraws,
  FriendlyFireAnnotation,
  IterationAnnotation,
  NoManaAnnotation,
  RecursionAnnotation,
} from '../../Annotations';
import { KeyContainer, KeyGroup, KeyItem } from '../../Key/Key';
import { TreeArrow } from './TreeArrow';

export const ActionTreeKey = () => {
  return (
    <KeyContainer>
      <KeyGroup title={'Action Calls'}>
        <KeyItem description={'Action drawn by the wand'}>
          <ActionSourceAnnotation source={'draw'} />
          <TreeArrow source={'draw'} />
        </KeyItem>
        <KeyItem description={'Action called by a perk'}>
          <ActionSourceAnnotation source={'perk'} />
          <TreeArrow source={'perk'} />
        </KeyItem>
        <KeyItem description={'Action called by another action'}>
          <ActionSourceAnnotation source={'action'} />
          <TreeArrow source={'action'} />
        </KeyItem>
        <KeyItem description={'Always Cast initial action call'}>
          <ActionSourceAnnotation source={'perm'} />
          <TreeArrow source={'perm'} />
        </KeyItem>
        <KeyItem
          description={'Grouping containing actions called in different ways'}
        >
          <ActionSourceAnnotation source={'multiple'} />
        </KeyItem>
      </KeyGroup>
      <KeyGroup title={'Actions not called'}>
        <KeyItem
          description={'Direct use of related projectile, action uncalled'}
        >
          <ActionSourceAnnotation source={'related'} />
        </KeyItem>
        <KeyItem description={'Directly discarded due to lack of mana'}>
          <DiscardedAnnotation reason={'mana'} />
        </KeyItem>
        <KeyItem description={'Directly discarded due to no charges remaining'}>
          <DiscardedAnnotation reason={'charges'} />
        </KeyItem>
        <KeyItem
          description={
            'No action call, directly discarded as a result of another action'
          }
        >
          <DiscardedAnnotation reason={'action'} />
        </KeyItem>
      </KeyGroup>
      <KeyGroup title={'Draw'}>
        <KeyItem description={'Shows the draw that is consumed by this spell.'}>
          <DrawAnnotationConsumed>1</DrawAnnotationConsumed>
        </KeyItem>
        <KeyItem
          description={
            'The number of spells this spell draws as part of its action.'
          }
        >
          <DrawAnnotationDraws>3</DrawAnnotationDraws>
        </KeyItem>
        <KeyItem
          description={
            'Wrap #N - This action was the last one called before the wand wrapped for the Nth time'
          }
        >
          {/* <WrapAnnotation scope={'cast'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Do not draw actions flag was set when this action was called'
          }
        >
          <DontDrawAnnotation dont_draw_actions={true} />
        </KeyItem>
      </KeyGroup>
      <KeyGroup title={'Iteration & Recursion'}>
        <KeyItem
          description={
            'Iteration counter value when action was called (only shown for Divide By). If the Iteration count exceeds its limit, Divide By makes only a single copy. Limits: D10: 2, D4: 3, D3: 3, D2: 4'
          }
        >
          <IterationAnnotation
            iteration={3}
            spell={getSpellByActionId('DIVIDE_3')}
          />
        </KeyItem>
        <KeyItem
          description={
            'Iteration count 1 above limit (chain is Draw Cancelled)'
          }
        >
          <IterationAnnotation
            iteration={4}
            spell={getSpellByActionId('DIVIDE_3')}
          />
        </KeyItem>
        <KeyItem
          description={
            'Iteration count 2 or more above limit (often this is a waste of Divides)'
          }
        >
          <IterationAnnotation
            iteration={5}
            spell={getSpellByActionId('DIVIDE_3')}
          />
        </KeyItem>
        <KeyItem
          description={
            'Identifies this as a recursive spell, and shows the recursion depth when its action was called. Recursive spells can only copy other recursive spells if the recursion depth is below 2.'
          }
        >
          <RecursionAnnotation
            recursion={1}
            spell={getSpellByActionId('GAMMA')}
          />
        </KeyItem>
        <KeyItem
          description={
            'Identifies a recursive action that was skipped having reached the maximum recursion depth. Shown only for recursive spells.'
          }
        >
          <RecursionAnnotation
            recursion={2}
            spell={getSpellByActionId('GAMMA')}
          />
        </KeyItem>
      </KeyGroup>
      <KeyGroup title={'Triggers & Scope'}>
        <KeyItem description={'Spell created a new scope.'}>
          {/* <ModificationAnnotation scope={'local'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Border showing Trigger payload scope. Most modifications only affect projectiles within the same scope. Some modifications (e.g. to Recharge Time) affect the root scope too.'
          }
        >
          {/* <ModificationAnnotation scope={'local'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Spell action copied by Add Trigger (before it fails to find, or validate, a target).'
          }
        >
          {/* <AddTriggerSeekAnnotation copied={true} discarded={false} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Spell discarded by Add Trigger (upon successful trigger projectile creation).'
          }
        >
          {/* <AddTriggerSeekAnnotation copied={true} discarded={true} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Spell copied and discarded by Add Trigger (upon successful trigger projectile creation).'
          }
        >
          {/* <AddTriggerSeekAnnotation copied={true} discarded={true} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Valid Add Trigger target spell (correct type, can be made into a trigger projectile)'
          }
        >
          {/* <AddTriggerTargetAnnotation status={'valid'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Invalid Add Trigger target spell (correct type, cannot be used to make a trigger projectile)'
          }
        >
          {/* <AddTriggerTargetAnnotation status={'invalid'} /> */}
        </KeyItem>
        <KeyItem description={'Add Trigger failed to find a target.'}>
          {/* <AddTriggerTargetAnnotation status={'none'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Add Trigger found a valid target, but could not validate a payload.'
          }
        >
          {/* <ModificationAnnotation scope={'local'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Action modified one or more variables in the current scope.'
          }
        >
          {/* <ModificationAnnotation scope={'local'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Action modified one or more variables in the root scope.'
          }
        >
          {/* <ModificationAnnotation scope={'root'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'One or more Projectiles were added to the current scope.'
          }
        >
          {/* <ProjectileAddedAnnotation /> */}
        </KeyItem>
        <KeyItem
          description={
            'This action adds one or more projectiles which have friendly fire enabled.'
          }
        >
          {/* <FriendlyFireAnnotation scope={'spell'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'This action enables friendly fire for all projectiles in the current scope.'
          }
        >
          {/* <FriendlyFireAnnotation scope={'cast'} /> */}
        </KeyItem>
      </KeyGroup>
    </KeyContainer>
  );
};
