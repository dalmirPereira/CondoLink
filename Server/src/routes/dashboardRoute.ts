import { Router, Request, Response } from 'express';
import { findUsers, findBuildings, findBlocks, getServices, getMaintenance } from '../services/dashboardServices'

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

interface Maintenance {
  id: number;
  task: string;
  buildingId: number;
  blockId: number;
  subcontractor: number | null;
  category: number;
  status: string;
  comment: string | null;
  created_at: string;
  dueTo: string;
}

interface DashboardData {
  users: User[];
  buildings: Building[];
  blocks: Block[];
  services: Service[];
  maintenance: Maintenance[];
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { id, roleCode, buildingId } = req.body;

  //check if they existe
  if (!id || !roleCode || !buildingId) {
    res.status(400)
      .json({ message: 'id, roleCod and buildingId are required.' });
    return;
  }


  try {
    const dashboardData: DashboardData = {
      users: [],
      buildings: [],
      blocks: [],
      services: [],
      maintenance: []
    };

    dashboardData.users = await findUsers(buildingId);
    dashboardData.buildings = await findBuildings(buildingId);
    dashboardData.blocks = await findBlocks(buildingId);
    dashboardData.services = await getServices();
    dashboardData.maintenance = await getMaintenance(buildingId);

    res.status(200).json(dashboardData);

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'An error occurred while fetching dashboard data.' });
  }
});

module.exports = router;