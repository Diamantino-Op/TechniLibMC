/**
 * @LICENSE MIT
 * @AUTHORS Diamantino
 */

/**
 * Properties used to create a new energy block.
 */
export type NewEnergyBlockProps = {
  storedEnergy?: bigint;
  maxStoredEnergy: bigint;
  maxExtract: bigint;
  maxInsert: bigint;
};

/**
 * Properties used to create a new voltage energy block.
 */
export type NewVoltageEnergyBlockProps = {
  storedEnergy?: bigint;
  maxStoredAmps: bigint;
  voltage: bigint;
  transferAmps: bigint;
  canExtract: boolean;
  canInsert: boolean;
};

/**
 * Json data for energy blocks.
 */
export interface JsonEnergyBlockData {
  typeId: string;
  energyJsonData: string;
  customJsonData: string;
}
