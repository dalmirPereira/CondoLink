const { PrismaClient } = require('../../generated/prisma'); 
const prisma = new PrismaClient();

const findUsers = async (buildingId: number) => {
    const result = await prisma.user.findMany({
        where: { 
            buildingId: buildingId,
            roleCode: { not: 3 } 
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            unit: true,
            roleCode: true,
            serviceType: true,
            companyName: true,
            phone: true,
            buildingId: true,
            blockId: true,
            approvedBy: true
        }
    });
    return result;
}

//--------------------------------------------------------------------------------------

const findBuildings = async (buildingId: number) => {
  const result = await prisma.buildings.findMany({
    where: { id: buildingId },
    select: {
      id: true,
      name: true,
      address: true,
      code: true
    },
  });
  return result;
};

//--------------------------------------------------------------------------------------

const findBlocks = async (buildingId: number) => {
  const result = await prisma.blocks.findMany({
    where: { building_id: buildingId },
    select: {
      id: true,
      name: true,
      building_id: true
    },
  });
  return result;
};

//--------------------------------------------------------------------------------------

const approveUser = async (userId: number, approvedBy: number) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      approvedBy: approvedBy,
    },
  });
  return result;
};

//--------------------------------------------------------------------------------------

interface NewSubcontractor {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  userId: number;
  buildingId: number;
  serviceType: number;
}

const addSub = async (newSub: NewSubcontractor): Promise<Resident> => {
  const created = await prisma.User.create({
    data: {
      fullName: newSub.fullName,
      companyName: newSub.companyName,
      email: newSub.email,
      phone: newSub.phone,
      password: newSub.password,
      buildingId: newSub.buildingId,
      approvedBy: newSub.userId,
      serviceType: newSub.serviceType,
      roleCode: 2, // 2 = subcontractor
  
    },
  });
  return created;
};

//--------------------------------------------------------------------------------------

interface Service {
  id: number;
  name: string;
}

const getServices = async (): Promise<Service> => {
  const result = await prisma.ServiceCategory.findMany();
  return result;
};

module.exports = {
 findUsers,
 findBuildings,
 findBlocks,
 approveUser,
 addSub,
 getServices
};