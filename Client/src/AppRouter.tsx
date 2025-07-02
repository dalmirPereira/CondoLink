import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardUsers from "./pages/dashboard/DashboardUsers";
import DashboardSubs from "./pages/dashboard/DashboardSubs";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/*Protected Routes*/}
        <Route path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >

          {/* Nested routes */}
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="subs" element={<DashboardSubs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter