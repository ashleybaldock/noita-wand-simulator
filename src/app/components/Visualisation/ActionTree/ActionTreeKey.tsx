import {
  ActionSourceAnnotation,
  DontDrawAnnotation,
  DrawAnnotation,
  FriendlyFireAnnotation,
  IterationAnnotation,
  NoManaAnnotation,
  RecursionAnnotation,
} from '../../Annotations';
import { KeyContainer, KeyGroup, KeyItem } from '../../Key/Key';

export const ActionTreeKey = () => {
  return (
    <KeyContainer>
      <KeyGroup title={'Action Calls'}>
        <KeyItem description={'Action drawn by the wand'}>
          <ActionSourceAnnotation source={'draw'} />
        </KeyItem>
        <KeyItem description={'Action called by a perk'}>
          <ActionSourceAnnotation source={'perk'} />
        </KeyItem>
        <KeyItem description={'Action called by another action'}>
          <ActionSourceAnnotation source={'action'} />
        </KeyItem>
        <KeyItem description={'Always Cast initial action call'}>
          <ActionSourceAnnotation source={'perm'} />
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
          <NoManaAnnotation />
        </KeyItem>
        <KeyItem description={'Directly discarded due to no charges remaining'}>
          {/* <NoChargesAnnotation /> */}
        </KeyItem>
        <KeyItem
          description={
            'No action call, directly discarded as a result of another action'
          }
        >
          {/* <DiscardedAnnotation reason={'action'} /> */}
        </KeyItem>
      </KeyGroup>
      <KeyGroup>
        <KeyItem
          description={
            'Shows the draw count before and after this action was called'
          }
        >
          <DrawAnnotation drawBefore={2} drawAfter={1} />
        </KeyItem>
        <KeyItem
          description={
            'Iteration counter value when action was called (only shown for Divide By)'
          }
        >
          <IterationAnnotation iteration={2} limit={3} />
        </KeyItem>
        <KeyItem description={'Iteration count above limit'}>
          <IterationAnnotation iteration={3} limit={3} />
        </KeyItem>
        <KeyItem
          description={
            'Recursion count when action was called (only shown for recursive spells)'
          }
        >
          {/* <RecursionAnnotation recursion={3} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Do not draw actions flag was set when this action was called'
          }
        >
          <DontDrawAnnotation dont_draw_actions={true} />
        </KeyItem>
        <KeyItem
          description={
            'This action adds one or more projectiles which have friendly fire enabled'
          }
        >
          {/* <FriendlyFireAnnotation scope={'spell'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'This action enables friendly fire for all multicast projectiles'
          }
        >
          {/* <FriendlyFireAnnotation scope={'cast'} /> */}
        </KeyItem>
        <KeyItem
          description={
            'Wrap #N - This action was the last one called before the wand wrapped for the Nth time'
          }
        >
          {/* <WrapAnnotation scope={'cast'} /> */}
        </KeyItem>
      </KeyGroup>
    </KeyContainer>
  );
};
