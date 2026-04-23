import {getSpellByActionId} from '../../../calc/spells';
import {
  ActionSourceAnnotation,
  DiscardedAnnotation,
  DontDrawAnnotation,
  DrawAnnotationConsumed,
  DrawAnnotationDraws,
  IterationAnnotation,
  MemoriseValueAnnotation,
  ProjectileAddedAnnotation,
  RecallValueAnnotation,
  RecursionAnnotation,
} from '../../Annotations';
import {Demo} from '../../Demo';
import {KeyContainer, KeyGroup, KeyItem, KeyNote} from '../../Key/Key';
import {TreeArrow} from './TreeArrow';

export const ActionTreeKey = () => {
  return (
    <Demo>
      <KeyContainer>
        <KeyGroup title={'Action Calls'}>
          <KeyNote>
            {
              'Wands contain Spells. Spells perform an Action. This Action can include adding Projectiles, applying Modifications, copying other Spells, running Scripted Effects and more.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Wands fire in a repeating pattern, each full cycle produces a Salvo consisting of one or more Casts. A Cast consists of one or more Spells, multicast together.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Each Cast is followed by one or more frames of Cast Delay. Each Salvo is followed by one or more frames of Recharge Time'
            }
          </KeyNote>
          <KeyNote>
            {
              'When fired the wand gathers (draws) enough spells to satisfy its Spells/Cast. When drawn (assuming there is sufficient mana and the spell has not exhausted its charges) the spell performs its action - which may include drawing more spells.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Spells that do not draw (including all Projectile, Static Projectile and Material type spells) result in a net reduction to draw of -1.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Spells that draw 1 (including all Modifier and Passive type spells) have no net effect on draw, and can be chained.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Spells that draw more than 1 (including all Multicast type spells) provide a net increase in draw, allowing more spells that do not draw to be cast together.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Other and Utility type spells vary, and some draw 0, 1, or more spells.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Some spells copy other spells actions (e.g. Alpha) or projectiles (e.g. Iplicate). Whether a spell draws or not is independent of any copies it may make.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Copying the action of a spell that draws also draws, unless the copying action suppresses it from doing so.'
            }
          </KeyNote>
        </KeyGroup>
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
          <KeyItem
            description={'Directly discarded due to no charges remaining'}
          >
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
          <KeyItem
            description={'Shows the draw that is consumed by this spell.'}
          >
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
        <KeyGroup title={'Spell Copying Spells & Recursion limits'}>
          <KeyNote>
            {
              'Some spells copy the action of other spells, mimicing their effects without them being drawn. This allows you to freely use spells that have a high mana cost or limited charges, and to make more copies of a spell than would otherwise be practical.'
            }
          </KeyNote>
          <KeyNote>
            {
              'Some Spell Copying Spells are capable of copying themselves, either directly or via a loop with another spell. These recursive copying loops are limited to a depth of 2. A recursive spell'
            }
            <RecursionAnnotation recursive={true} recursion={2} />
            {' copied by a recursive spell'}
            <RecursionAnnotation recursive={true} recursion={1} />
            {'copied by a recursive spell'}
            <RecursionAnnotation recursive={true} recursion={0} />
            {'will make no copies.'}
          </KeyNote>
          <KeyItem
            description={
              'Identifies this as a recursive spell, and shows the recursion depth . Recursive spells can only copy other recursive spells if the recursion depth is less than 2.'
            }
          >
            <RecursionAnnotation recursion={1} recursive={true} />
          </KeyItem>
          <KeyItem
            description={
              'Identifies a recursive spell whose action was skipped having reached the maximum recursion depth.'
            }
          >
            <RecursionAnnotation recursion={2} recursive={true} />
          </KeyItem>
        </KeyGroup>
        <KeyGroup title={'Divide By Spells & Iteration limits'}>
          <KeyNote>
            {
              'The Divide By spells copy other spells by repeatedly invoking their action - two, three, four or ten times. The first copy is made after setting the'
            }
            <DontDrawAnnotation dont_draw_actions={true} />
            {
              'Do Not Draw flag, but the rest of the action copies are not prevented from drawing. Divides themselves do not draw. A spell is directly discarded after copies are made (usually, but not always, the one that was copied).'
            }
          </KeyNote>
          <KeyNote>
            {
              'A Divide can copy the action of another Divide, creating a Divide Chain. While Divide Chains can contain any number of Divides (in any order), each of the Divides has a limit on how many iterations deep it can be in the chain while still creating additional copies. '
            }
          </KeyNote>
          <KeyNote>
            {
              ' In simple cases (copying a spell that does not draw) the total number of copies is multiplied by each Divide By in the chain, up to a maximum of 800.'
            }
          </KeyNote>
          <KeyItem
            description={
              'Iteration counter value when action was called (only shown for Divide By). If the Iteration count exceeds its limit, Divide By makes only a single copy. Limits: D10: 2, D4: 3, D3: 3, D2: 4'
            }
          >
            <IterationAnnotation
              iteration={3}
              limit={3}
              iterative={true}
            />
          </KeyItem>
          <KeyItem
            description={
              'Iteration count 1 above limit (chain is Draw Cancelled)'
            }
          >
            <IterationAnnotation
              iteration={4}
              limit={3}
              iterative={true}
            />
          </KeyItem>
          <KeyItem
            description={
              'Iteration count 2 or more above limit (often this is a waste of Divides)'
            }
          >
            <IterationAnnotation
              iteration={5}
              limit={3}
              iterative={true}
            />
          </KeyItem>
        </KeyGroup>
        <KeyGroup title={'Spell Memory'}>
          <KeyItem description={`Current value of 'Recharge Time' memorised.`}>
            <MemoriseValueAnnotation stat={'reload_time'} />
          </KeyItem>
          <KeyItem
            description={`Value of 'Recharge Time' set to previously memorised value.`}
          >
            <RecallValueAnnotation stat={'reload_time'} />
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
            <ProjectileAddedAnnotation />
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
    </Demo>
  );
};
