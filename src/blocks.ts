/**
 * @LICENSE MIT
 * @AUTHORS Diamantino
 */

import { world } from "@minecraft/server";
import * as constants from "./constants";

/**
 * Interface for energy machines.
 */
export interface IEnergyBlock {
  storedEnergy: bigint;
  maxExtract: bigint;
  maxInser: bigint;
  voltage: bigint;
  amps: bigint;
  useVoltage: boolean;
}

/**
 * Register a new energy block.
 */
export function registerEnergyBlock(typeId: string, energyBlock: IEnergyBlock) {
  let registeredMachines = world.getDynamicProperty(
    constants.registeredBlocksProperty,
  );
}
