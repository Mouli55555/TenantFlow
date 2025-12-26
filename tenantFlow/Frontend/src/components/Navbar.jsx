import { getUser, logout } from "../auth/auth"
import { Link } from "react-router-dom"

export default function Navbar() {
  const user = getUser()

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center shadow">
      <div className="text-lg font-bold tracking-wide">
        TenantFlow
      </div>

      <div className="flex gap-6 ml-10 text-sm font-medium">
        {user?.role === "super_admin" && (
          <Link
            to="/tenants"
            className="hover:text-indigo-400 transition"
          >
            Tenants
          </Link>
        )}

        {user?.role === "tenant_admin" && (
          <>
            <Link
              to="/dashboard"
              className="hover:text-indigo-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="hover:text-indigo-400 transition"
            >
              Projects
            </Link>
            <Link
              to="/users"
              className="hover:text-indigo-400 transition"
            >
              Users
            </Link>
            <Link
              to="/settings"
              className="hover:text-indigo-400 transition"
            >
              Organization
            </Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link
              to="/dashboard"
              className="hover:text-indigo-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="hover:text-indigo-400 transition"
            >
              Projects
            </Link>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-xs text-slate-400">
          {user?.email}
        </span>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
