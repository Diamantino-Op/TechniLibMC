/**
 * @LICENSE BSD-2-Clause
 * @AUTHORS Diamantino
 */

import { IEnergyStorage, IVoltageEnergyStorage } from "./energy";

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

/**
 * Json data for voltage energy blocks.
 */
export interface JsonVoltageEnergyBlockData {
  energyData: IEnergyStorage;
  voltageEnergyData: IVoltageEnergyStorage;
}

/**
 * Packet that is sent via script event to register a machine.
 */
export interface RegisterEnergyBlockPacket {
  typeId: string;
  addonId: string;
}
