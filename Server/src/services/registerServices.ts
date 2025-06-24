const { PrismaClient } = require('../generated/prisma'); 
const prisma = new PrismaClient();

export interface Email {
  email: string;
}

export const findEmail = async (email: string): Promise<Email | null> => {

  const result = await prisma.User.findUnique({
    where: {
      email: email,
    },
    select: {
      email: true,
    },
  });

  return result;
};

//--------------------------------------------------------------------------------------

interface Resident {
    fullName: string;
    email: string;
    password: string;
    buildingId: number;
    blockId: number;
}

const createUser = async (newResident: Resident): Promise<Resident> => {

  const created = await prisma.User.create({
    data: {
      fullName: newResident.fullName,
      email: newResident.email,
      password: newResident.password,
      buildingId: newResident.buildingId,
      blockId: newResident.blockId,
      roleCode: 1 // 1 = Resident
    },
  });

  return created;
};



module.exports = {
  findEmail,
  createUser
};