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

const getMaintenance = async () => {
  const result = await prisma.maintenance.findMany();
  return result;
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

//--------------------------------------------------------------------------------------
interface MaintenanceInput {
  task: string;
  buildingId: number;
  blockId: number;
  subcontractor?: number | null;
  category: number;
  status: string;
  comment?: string | null;
  dueTo: string; // ISO date string
}

export async function addMaintenance(newTask: MaintenanceInput) {
  const created = await prisma.maintenance.create({
    data: {
      task: newTask.task,
      buildingId: newTask.buildingId,
      blockId: Number(newTask.blockId),  // Ensure number here
      subcontractor: newTask.subcontractor ? Number(newTask.subcontractor) : null,
      category: Number(newTask.category),
      status: newTask.status,
      comment: newTask.comment ?? null,
      dueTo: new Date(newTask.dueTo),
    },
  });

  return created;
}

//--------------------------------------------------------------------------------------
export async function updateMaintenance(id: number, data: MaintenanceInput) {

  const updated = await prisma.maintenance.update({
    where: { id },
    data: {
      task: data.task,
      buildingId: data.buildingId,
      blockId: Number(data.blockId),
      subcontractor: Number(data.subcontractor) ?? null,
      category: Number(data.category),
      status: data.status,
      comment: data.comment ?? null,
      dueTo: new Date(data.dueTo),
      // optionally update updated_at here if you have such a field
    },
  });

  return updated;
}
//--------------------------------------------------------------------------------------
export async function deleteMaintenance(id: number) {

  const deletedMaintenance = await prisma.maintenance.delete({
    where: { id },
  });
  return deletedMaintenance;
}
//--------------------------------------------------------------------------------------
interface SubcontractorUpdateInput {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  serviceType: number;
  password?: string;
}

export async function updateSubcontractor(id: number, data: SubcontractorUpdateInput) {
  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      email: data.email,
      serviceType: data.serviceType,
      ...(data.password ? { password: data.password } : {})
    },
  });

  return updated;
}
//--------------------------------------------------------------------------------------
export async function deleteUser(id: number) {

  const deleteUser = await prisma.user.delete({
    where: { id },
  });
  return deleteUser;
}
//--------------------------------------------------------------------------------------
interface UserUpdateInput {
  fullName: string;
  email: string;
  buildingId: number;
  blockId?: number | null;
  unit: string;
  password?: string; // optional
}

export async function updateUser(id: number, data: UserUpdateInput) {
  const updated = await prisma.user.update({
    where: { id },
    data: {
      fullName: data.fullName,
      email: data.email,
      buildingId: data.buildingId,
      blockId: data.blockId ?? null,
      unit: data.unit
    },
  });

  return updated;
}

module.exports = {
  findUsers,
  findBuildings,
  findBlocks,
  approveUser,
  addSub,
  getServices,
  getMaintenance,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateSubcontractor,
  deleteUser,
  updateUser
};