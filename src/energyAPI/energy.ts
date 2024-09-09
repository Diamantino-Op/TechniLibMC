/**
 * @LICENSE BSD-2-Clause
 * @AUTHORS Diamantino
 */

import { system } from "@minecraft/server";
import { EnergyBlock } from "./blocks";
import * as energyBlocks from "./blocks";

/**
 * The ID of the addon that is using the energy API.
 */
export let currentAddonId: string;

/**
 * Interface for things that use energy.
 */
export interface IEnergyStorage {
  storedEnergy: bigint;
  maxStoredEnergy: bigint;
  maxExtract: bigint;
  canExtract: boolean;
  maxInsert: bigint;
  canInsert: boolean;
}

/**
 * Interface for things that use energy.
 */
export interface IVoltageEnergyStorage {
  voltage: bigint;
  transferAmps: bigint;
}

/**
 * An energy packet for non voltage energy.
 */
export interface EnergyPacket {
  transferEnergy: bigint;
}

/**
 * An energy packet for voltage energy.
 */
export interface VoltageEnergyPacket extends EnergyPacket {
  voltage: bigint;
  transferAmps: bigint;
}

/**
 * Initialize the energy API.
 */
export function initEnergyAPI(addonId: string) {
  currentAddonId = addonId;

  energyBlocks.initBlocks();

  system.runInterval(() => update(), 1);
}

/**
 * Energy API update.
 */
export function update() {
  energyBlocks.updateBlocks();
}
