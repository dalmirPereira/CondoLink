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

export const findUserByEmail = async (email: string): Promise<Email | null> => {
  const result = await prisma.User.findUnique({
    where: { email: email }
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
    unit: string;
}

const createUser = async (newResident: Resident): Promise<Resident> => {
  const created = await prisma.User.create({
    data: {
      fullName: newResident.fullName,
      email: newResident.email,
      password: newResident.password,
      buildingId: newResident.buildingId,
      blockId: newResident.blockId,
      roleCode: 1, // 1 = Resident
      unit: newResident.unit,
    },
  });
  return created;
};

//--------------------------------------------------------------------------------------

const updateUser = async (userId: number, userRefreshToken: string): Promise<User> => {
  const updatedUser = await prisma.User.update({
    where: { id: userId },
    data: { refreshToken: userRefreshToken }
  });
  return updatedUser;
};

module.exports = {
  findEmail,
  findUserByEmail,
  createUser,
  updateUser
};