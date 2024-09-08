/**
 * @LICENSE MIT
 * @AUTHORS Diamantino
 */

import { EnergyBlock } from "./blocks";

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
 * Initialize the energy API.
 */
export function initEnergyAPI(addonId: string) {
  currentAddonId = addonId;
}
