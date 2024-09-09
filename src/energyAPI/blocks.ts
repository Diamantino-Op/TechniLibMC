/**
 * @LICENSE BSD-2-Clause
 * @AUTHORS Diamantino
 */

import { Vector3, world } from "@minecraft/server";
import {
  savedEnergyBlocksProperty,
  savedEnergyBlockProperty,
} from "./constants";
import {
  currentAddonId,
  EnergyPacket,
  IEnergyStorage,
  IVoltageEnergyStorage,
  VoltageEnergyPacket,
} from "./energy";
import {
  NewEnergyBlockProps,
  NewVoltageEnergyBlockProps,
  JsonEnergyBlockData,
  JsonVoltageEnergyBlockData,
} from "./types";
import { ClassMap } from "utils/classUtils";
import { bigMin } from "utils/bigMath";

/**
 * Contains a map of the registed energy blocks.
 */
const registeredEnergyBlocks: ClassMap = {};

const placedEnergyBlocks: Map<Vector3, EnergyBlock> = new Map<
  Vector3,
  EnergyBlock
>();

/**
 * Class for energy machines.
 */
export class EnergyBlock {
  energyStorage: IEnergyStorage;

  typeId: string;

  isDirty: boolean;

  constructor(
    typeId: string,
    newEnergyBlockProps: NewEnergyBlockProps,
    energyJsonData: string,
    customJsonData: string,
  ) {
    this.typeId = typeId;

    this.isDirty = false;

    this.energyStorage = {
      storedEnergy:
        newEnergyBlockProps.storedEnergy != undefined
          ? newEnergyBlockProps.storedEnergy
          : 0n,
      maxStoredEnergy: newEnergyBlockProps.maxStoredEnergy,
      maxExtract: newEnergyBlockProps.maxExtract,
      canExtract: !(newEnergyBlockProps.maxExtract <= 0),
      maxInsert: newEnergyBlockProps.maxInsert,
      canInsert: !(newEnergyBlockProps.maxInsert <= 0),
    };

    this.loadEnergy(energyJsonData);
    this.loadCustom(customJsonData);
  }

  public update() {}

  public acceptEnergy(energypacket: EnergyPacket): bigint {
    const actualTransfer: bigint = bigMin(energypacket.transferEnergy);

    return 0n;
  }

  public provideEnergy() {}

  public saveEnergy(): string {
    return JSON.stringify(this.energyStorage);
  }

  public loadEnergy(jsonData: string) {
    this.energyStorage = JSON.parse(jsonData);
  }

  public saveCustom(): string {
    return "";
  }

  public loadCustom(jsonData: string) {}
}

/**
 * Class for energy machines that uses voltage.
 */
export class VoltageEnergyBlock extends EnergyBlock {
  voltageEnergyStorage: IVoltageEnergyStorage;

  constructor(
    typeId: string,
    newVoltageEnergyBlockProps: NewVoltageEnergyBlockProps,
    energyJsonData: string,
    customJsonData: string,
  ) {
    super(
      typeId,
      {
        storedEnergy: newVoltageEnergyBlockProps.storedEnergy,
        maxStoredEnergy:
          newVoltageEnergyBlockProps.maxStoredAmps *
          newVoltageEnergyBlockProps.voltage,
        maxExtract:
          newVoltageEnergyBlockProps.transferAmps *
          newVoltageEnergyBlockProps.voltage,
        maxInsert:
          newVoltageEnergyBlockProps.transferAmps *
          newVoltageEnergyBlockProps.voltage,
      },
      energyJsonData,
      customJsonData,
    );

    this.voltageEnergyStorage = {
      voltage: newVoltageEnergyBlockProps.voltage,
      transferAmps: newVoltageEnergyBlockProps.transferAmps,
    };
  }

  public override update() {
    super.update();
  }

  public override acceptEnergy(energypacket: VoltageEnergyPacket): bigint {
    return 0n;
  }

  public override provideEnergy() {}

  public override saveEnergy(): string {
    return JSON.stringify({
      energyData: this.energyStorage,
      voltageEnergyData: this.voltageEnergyStorage,
    } as JsonVoltageEnergyBlockData);
  }

  public override loadEnergy(jsonData: string) {
    const jsonVoltageEnergyData: JsonVoltageEnergyBlockData =
      JSON.parse(jsonData);

    this.energyStorage = jsonVoltageEnergyData.energyData;
    this.voltageEnergyStorage = jsonVoltageEnergyData.voltageEnergyData;
  }
}

/**
 * Cable network class.
 */
export class CableNetwork {
  netId: string;
  connections: Vector3[];
}

/**
 * Voltage cable network class.
 */
export class VoltageCableNetwork extends CableNetwork {
  voltage: bigint;
  amps: bigint;
}

/**
 * Register a new energy block.
 */
export function registerEnergyBlock(
  typeId: string,
  energyBlock: typeof EnergyBlock,
  energyBlockSettings: NewEnergyBlockProps,
) {
  registeredEnergyBlocks[typeId] = {
    classType: energyBlock,
    settings: energyBlockSettings,
  };
}

/**
 * Creates a new instance of the given energy block.
 */
function placeNewEnergyBlock(
  typeId: string,
  energyJsonData: string,
  customJsonData: string,
): EnergyBlock {
  const newEnergyBlock: EnergyBlock = registeredEnergyBlocks[typeId].classType(
    typeId,
    registeredEnergyBlocks[typeId].settings,
    energyJsonData,
    customJsonData,
  );

  return newEnergyBlock ? newEnergyBlock : null;
}

/**
 * Saves all the placed energy blocks.
 */
export function savePlacedEnergyBlocks() {
  const placedEnergyBlocksPos: Vector3[] = [];

  placedEnergyBlocks.forEach((energyBlock, pos) => {
    placedEnergyBlocksPos.push(pos);

    world.setDynamicProperty(
      `${savedEnergyBlockProperty}_${currentAddonId}_${pos.x}_${pos.y}_${pos.z}`,
      JSON.stringify({
        typeId: energyBlock.typeId,
        energyJsonData: energyBlock.saveEnergy(),
        customJsonData: energyBlock.saveCustom(),
      } as JsonEnergyBlockData),
    );
  });

  world.setDynamicProperty(
    `${savedEnergyBlocksProperty}_${currentAddonId}`,
    JSON.stringify(placedEnergyBlocksPos),
  );
}

/**
 * Saves all the placed energy blocks positions.
 */
export function savePlacedEnergyBlocksPositions() {
  const placedEnergyBlocksPos: Vector3[] = [];

  placedEnergyBlocks.forEach((_, pos) => placedEnergyBlocksPos.push(pos));

  world.setDynamicProperty(
    `${savedEnergyBlocksProperty}_${currentAddonId}`,
    JSON.stringify(placedEnergyBlocksPos),
  );
}

/**
 * Saves the specified placed energy block.
 */
export function savePlacedEnergyBlock(
  energyBlock: EnergyBlock,
  energyBlockPosition: Vector3,
) {
  world.setDynamicProperty(
    `${savedEnergyBlockProperty}_${currentAddonId}_${energyBlockPosition.x}_${energyBlockPosition.y}_${energyBlockPosition.z}`,
    JSON.stringify({
      typeId: energyBlock.typeId,
      energyJsonData: energyBlock.saveEnergy(),
      customJsonData: energyBlock.saveCustom(),
    } as JsonEnergyBlockData),
  );
}

/**
 * Loads all the placed energy blocks.
 */
export function loadEnergyBlocks() {
  const placedEnergyBlocksPos: Vector3[] = JSON.parse(
    world.getDynamicProperty(
      `${savedEnergyBlocksProperty}_${currentAddonId}`,
    ) as string,
  ) as Vector3[];

  placedEnergyBlocksPos.forEach((pos) => {
    const placedEnergyBlock: JsonEnergyBlockData = JSON.parse(
      world.getDynamicProperty(
        `${savedEnergyBlockProperty}_${currentAddonId}_${pos.x}_${pos.y}_${pos.z}`,
      ) as string,
    ) as JsonEnergyBlockData;

    const newEnergyBlock: EnergyBlock = placeNewEnergyBlock(
      placedEnergyBlock.typeId,
      placedEnergyBlock.energyJsonData,
      placedEnergyBlock.customJsonData,
    );

    placedEnergyBlocks.set(pos, newEnergyBlock);
  });
}

/**
 * Init energy blocks.
 */
export function initBlocks() {
  loadEnergyBlocks();
}

/**
 * Energy blocks update.
 */
export function updateBlocks() {
  placedEnergyBlocks.forEach((energyBlock, pos) => {
    if (energyBlock.isDirty) {
      savePlacedEnergyBlock(energyBlock, pos);

      energyBlock.isDirty = false;
    }
  });
}
