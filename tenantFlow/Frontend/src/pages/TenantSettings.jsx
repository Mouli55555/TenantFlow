import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify"
import { getUser } from "../auth/auth"

export default function TenantSettings() {
  const user = getUser()

  const [tenant, setTenant] = useState(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  const loadTenant = async () => {
    try {
      const res = await api.get("/tenants/me")
      setTenant(res.data.data)
      setName(res.data.data.name)
    } catch {
      toast.error("Failed to load organization details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenant()
  }, [])

  const updateName = async () => {
    if (!name.trim()) {
      toast.error("Company name cannot be empty")
      return
    }

    try {
      await api.put(`/tenants/${tenant.id}`, { name })
      toast.success("Company name updated successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed")
    }
  }

  if (loading) return null

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Organization Settings
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Company Name
          </label>

          <input
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={updateName}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Subscription Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Plan</p>
              <p className="font-medium text-slate-800">
                {tenant.subscription_plan}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-medium text-slate-800">
                {tenant.status}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Max Users</p>
              <p className="font-medium text-slate-800">
                {tenant.max_users}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Max Projects</p>
              <p className="font-medium text-slate-800">
                {tenant.max_projects}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
