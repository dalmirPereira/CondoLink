import { Router, Request, Response } from 'express';
import {
  updateSubcontractor,
  deleteMaintenance,
  updateMaintenance,
  approveUser,
  addSub,
  addMaintenance,
  deleteUser,
  updateUser
} from '../services/adminServices'
const { handleMissingFields, isMissing } = require('../controllers/registerControllers');
const { findEmail } = require('../services/userServices');

//Require needed for uncrypting the password
const bcrypt = require('bcrypt');
const { saltRound } = require('../config/saltRound')

const router = Router();

//----------------------------a POST request to approve user------------------------------------------------
router.post('/approveUser', async (req: Request, res: Response): Promise<void> => {
  const { userId, approvedBy } = req.body;

  //check if id existe
  if (!userId || !approvedBy) {
    res.status(400)
      .json({ message: 'id and approvedBy are required.' });
  }

  try {
    const result = await approveUser(userId, approvedBy);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ message: 'An error occurred while approving user.' });
  }
});

//----------------------------a POST request to add new sub------------------------------------------------
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

router.post('/addSub', async (req: Request, res: Response): Promise<void> => {
  const newSub: NewSubcontractor = req.body;

  // check for missing fields
  const missingFields = await handleMissingFields(newSub);
  if (missingFields.length > 0) {
    res.status(400).json({
      message: `The following fields are required and missing or wrong: ${missingFields.join(', ')}`
    });
  }

  // check for duplicate email in the db
  const duplicate = await findEmail(newSub.email);
  if (duplicate && duplicate.length > 0) {
    res.status(409).json({ message: 'Email already registered. Choose another email.' })
  }; //Conflict 

  try {
     if (newSub.password) {
      const hashedPassword = await bcrypt.hash(newSub.password, saltRound);
      newSub.password = hashedPassword;
    }
    const result = await addSub(newSub);

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ message: 'An error occurred while approving user.' });
  }
});

//----------------------------a POST request to add new maintenance------------------------------------------------

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

router.post('/addMaintenance', async (req: Request, res: Response): Promise<void> => {
  const newTask = req.body as MaintenanceInput;

  // Validate required fields
  const requiredFields = ['task', 'buildingId', 'blockId', 'category', 'status', 'dueTo'];
  const missingFields = requiredFields.filter(
    field => isMissing(newTask[field as keyof MaintenanceInput])
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `The following fields are required and missing or invalid: ${missingFields.join(', ')}`
    });
    return;
  }

  try {
    const result = await addMaintenance(newTask);

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error('Error adding maintenance:', error);
    res.status(500).json({ message: 'Failed to add maintenance task.' });
  }
});

//----------------------------a PUT request to update existing maintenance------------------------------------------------

interface MaintenanceUpdateInput {
  id: number;            // maintenance id to update
  task: string;
  buildingId: number;
  blockId: number;
  subcontractor?: number | null;
  category: number;
  status: string;
  comment?: string | null;
  dueTo: string; // ISO date string
}

router.put('/updateMaintenance/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const updateData = req.body as MaintenanceUpdateInput;

  if (!id || id !== updateData.id) {
    return res.status(400).json({ message: 'Maintenance ID is missing or does not match URL.' });
  }

 // Validate required fields
  const requiredFields = ['task', 'buildingId', 'blockId', 'category', 'status', 'dueTo'];
  const missingFields = requiredFields.filter(
    field => isMissing(updateData[field as keyof MaintenanceUpdateInput])
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `The following fields are required and missing or invalid: ${missingFields.join(', ')}`
    });
    return;
  }

  try {
    const updatedMaintenance = await updateMaintenance(id, updateData);

    res.status(200).json({ success: true, result: updatedMaintenance });
  } catch (error: any) {
    console.error('Error updating maintenance:', error);
    res.status(500).json({ message: 'Failed to update maintenance task.' });
  }
});

//----------------------------a DELETE request to delete maintenance------------------------------------------------
router.delete('/deleteMaintenance/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const deleted = await deleteMaintenance(id);
    res.status(200).json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: error.message || 'Failed to delete maintenance task.' });
  }
});

//----------------------------a PUT request to update existing subcontractor------------------------------------------------
interface SubcontractorUpdateInput {
  id: number;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  serviceType: number;
  password?: string; // optional to update
}

router.put('/updateSub/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const updateData = req.body as SubcontractorUpdateInput;

  if (!id) {
    res.status(400).json({ message: 'Subcontractor ID is missing or does not match URL.' });
    return;
  }

  const requiredFields = ['fullName', 'companyName', 'phone', 'email', 'serviceType'];
const missingFields = requiredFields.filter(
    field => isMissing(updateData[field as keyof SubcontractorUpdateInput])
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `The following fields are required and missing or invalid: ${missingFields.join(', ')}`
    });
    return;
  }

  try {
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, saltRound);
      updateData.password = hashedPassword;
    }

    const updatedSub = await updateSubcontractor(id, updateData);

    res.status(200).json({ success: true, result: updatedSub });
  } catch (error) {
    console.error('Error updating subcontractor:', error);
    res.status(500).json({ message: 'Failed to update subcontractor.' });
  }
});

//----------------------------a DELETE request to delete users------------------------------------------------
router.delete('/deleteUser/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const deleted = await deleteUser(id);
    res.status(200).json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error deleting maintenance:', error);
    res.status(500).json({ message: error.message || 'Failed to delete maintenance task.' });
  }
});
//----------------------------PUT request to update existing user------------------------------------------------
interface UserUpdateInput {
  id: number;
  fullName: string;
  email: string;
  buildingId: number;
  blockId?: number | null;
  unit: string;
}

router.put('/updateUser/:id', async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const updateData = req.body as UserUpdateInput;

  // Validate ID in URL
  if (!id) {
    res.status(400).json({ message: 'User ID is missing or does not match URL.' });
    return;
  }

  // Validate required fields
  const requiredFields = ['fullName', 'email', 'buildingId', 'unit'];
  const missingFields = requiredFields.filter(
    field => isMissing(updateData[field as keyof UserUpdateInput])
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: `The following fields are required and missing or invalid: ${missingFields.join(', ')}`
    });
    return;
  }

  try {
    const updatedUser = await updateUser(id, updateData);
    res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

module.exports = router;