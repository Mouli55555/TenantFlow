import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"
import Users from "./pages/Users"
import Tenants from "./pages/Tenants"
import TenantSettings from "./pages/TenantSettings"

import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute roles={["tenant_admin", "user"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Tasks />} />
        </Route>

        <Route element={<ProtectedRoute roles={["tenant_admin"]} />}>
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<TenantSettings />} />
        </Route>

        <Route element={<ProtectedRoute roles={["super_admin"]} />}>
          <Route path="/tenants" element={<Tenants />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
