import { AuthProvider } from "./AuthContext.tsx";
import { DashboardProvider } from "./DashboardContext.tsx";

interface MyComponentProps {
      children: React.ReactNode;
    }

 const IndexContext: React.FC<MyComponentProps> = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <DashboardProvider>
                    {children}
                </DashboardProvider>
            </AuthProvider>
        </>
    )
};


export default IndexContext;