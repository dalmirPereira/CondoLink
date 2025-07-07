import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useAuth } from "./AuthContext";

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
  aapprovedBy: number | null;
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
  maintenance: Maintenance[]
}

interface DashboardContextType {
  dashboardData: DashboardData | null;
  getDashboardData: () => Promise<void>;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData | null>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { axiosInstance, auth, logout } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const isFetching = useRef(false);

  const getDashboardData = async () => {
    if (!auth || isFetching.current) return;

    isFetching.current = true;
    try {
      const response = await axiosInstance.post<DashboardData>(
        "/dashboard",
        { id: auth.id, roleCode: auth.roleCode, buildingId: auth.buildingId },
        { headers: { Authorization: `Bearer ${auth.accessToken}` } }
      );
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setDashboardData(null);
      logout();
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (auth) {
      getDashboardData();
    } else {
      setDashboardData(null);
    }
  }, [auth]);

  return (
    <DashboardContext.Provider value={{ dashboardData, getDashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
