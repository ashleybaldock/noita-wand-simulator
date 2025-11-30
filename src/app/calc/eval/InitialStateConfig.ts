export type InitialSimulationStateConfig = {
  wand_available_mana: number;
  rng_worldSeed: number;
  rng_frameNumber: number;
  req_half: boolean;
  req_hp: boolean;
  req_projectiles: boolean;
  req_enemies: boolean;
};

export const defaultSimulationStateConfig: InitialSimulationStateConfig = {
  wand_available_mana: 1000,
  rng_worldSeed: 0,
  rng_frameNumber: 1,
  req_half: false,
  req_hp: false,
  req_projectiles: false,
  req_enemies: false,
};

export const mergeInitialStateConfigDefaults = (
  startingState: Partial<InitialSimulationStateConfig>,
): Readonly<InitialSimulationStateConfig> => ({
  ...defaultSimulationStateConfig,
  ...startingState,
});
