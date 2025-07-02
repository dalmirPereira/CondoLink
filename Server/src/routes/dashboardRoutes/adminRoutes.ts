import { Router, Request, Response } from 'express';
import { approveUser, findUsers, findBuildings, findBlocks, addSub, getServices } from '../../services/dashboardServices/adminServices'
const { handleMissingFields } = require('../../controllers/registerControllers');
const { findEmail } = require('../../services/userServices');

const router = Router();

//-------------------- a POST request to get dashboard data -----------------------
interface User {
  id: number;
  fullName: string;
  email: string;
  unit: string;
  roleCode: number;
  companyName: string | null;
  serviceType: number | null;
  phone: string | null;
  buildingId: number | null;
  blockId: number | null;
  approvedBy: number | null;
}

interface Building {
  id: number;
  name: string;
  address: string | null;
  code: string;
}

interface Block {
  id: number;
  name: string;
  buildingId: number;
}

interface Service {
  id: number;
  name: string;
}

interface DashboardData {
  users: User[];
  buildings: Building[];
  blocks: Block[];
  services: Service[];
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { id, roleCode, buildingId } = req.body;

  //check if they existe
  if (!id || !roleCode || !buildingId) {
    res.status(400)
      .json({ message: 'id, roleCod and buildingId are required.' });
  }


  try {
    const dashboardData: DashboardData = {
      users: [],
      buildings: [],
      blocks: [],
      services: []
    };

    // Fetch users only if the requester is an admin (roleCode === 3)
    if (roleCode === 3) {
      dashboardData.users = await findUsers(buildingId);
    }

    // Fetch buildings and blocks regardless of role
    dashboardData.buildings = await findBuildings(buildingId);
    dashboardData.blocks = await findBlocks(buildingId);
    dashboardData.services = await getServices();

    res.status(200).json(dashboardData);

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'An error occurred while fetching dashboard data.' });
  }
});

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
    const result = await addSub(newSub);

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ message: 'An error occurred while approving user.' });
  }
});


module.exports = router;