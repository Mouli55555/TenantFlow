import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"
import { getUser } from "../auth/auth"

export default function Dashboard() {
  const user = getUser()

  const [stats, setStats] = useState({
    projects: 0,
    users: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const projectsRes = await api.get("/projects")

        let usersCount = 0
        if (user.role === "tenant_admin") {
          const usersRes = await api.get("/users")
          usersCount = usersRes.data.data.length
        }

        setStats({
          projects: projectsRes.data.data.length,
          users: usersCount,
        })
      } catch {}
    }

    loadStats()
  }, [user.role])

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Welcome back
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-500 text-sm mb-1">Total Projects</p>
            <h2 className="text-4xl font-bold text-indigo-600">
              {stats.projects}
            </h2>
          </div>

          {user.role === "tenant_admin" && (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-slate-500 text-sm mb-1">Total Users</p>
              <h2 className="text-4xl font-bold text-emerald-600">
                {stats.users}
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
