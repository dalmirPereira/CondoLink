const { PrismaClient } = require('../generated/prisma'); 
const prisma = new PrismaClient();

export interface Building {
  id: number;
  name: string;
}

export interface Block {
  id: number;
  name: string;
  building_id: number;
}

export const getBuildingsAndBlocks = async (): Promise<{
  buildings: Building[];
  blocks: Block[];
}> => {
  const buildings = await prisma.buildings.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const blocks = await prisma.blocks.findMany({
    select: {
      id: true,
      name: true,
      building_id: true
    },
  });

  return { buildings, blocks };
};

module.exports = {
  getBuildingsAndBlocks
};