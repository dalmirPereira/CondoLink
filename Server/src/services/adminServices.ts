const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

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
      blockId: Number(data.blockId)?? null,
      subcontractor: data.subcontractor ? Number(data.subcontractor) : null,
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
  approveUser,
  addSub,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  updateSubcontractor,
  deleteUser,
  updateUser
};