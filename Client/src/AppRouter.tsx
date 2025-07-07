import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

import AdminHome from "./pages/dashboard/AdminHome";
import AdminResidents from "./pages/dashboard/AdminResidents";
import AdminSubs from "./pages/dashboard/AdminSubs";
import AdminMaintenance from "./pages/dashboard/AdminMaintenance"

import SubsHome from "./pages/dashboard/SubsHome";

import ResidentsHome from "./pages/dashboard/ResidentsHome";

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
          {/* Nested routes to Admin */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={[3]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="residents" element={<AdminResidents />} />
            <Route path="subs" element={<AdminSubs />} />
            <Route path="maintenance" element={<AdminMaintenance />} />
          </Route>

          {/* Nested routes to Subcontractor */}
          <Route
            path="subs"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<SubsHome />} />
          </Route>

          {/* Nested routes to Residents */}
          <Route
            path="resident"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<ResidentsHome />} />
          </Route>


        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter