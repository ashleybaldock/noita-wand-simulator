import type { ActionId } from './actionId';
import * as main from './__generated__/main/extraEntities';

export type ExtraEntity = (typeof main.extraEntities)[number];

export const extraEntities = main.extraEntities as ReadonlyArray<ExtraEntity>;

export type ActionIdToExtraEntityMap = Record<
  ActionId,
  ReadonlyArray<ExtraEntity>
>;

const actionIdToExtraEntities = main.actionIdExtraEntities as Partial<
  Record<ActionId, ReadonlyArray<ExtraEntity>>
>;
