import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify"

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [editingTenantId, setEditingTenantId] = useState(null)
  const [form, setForm] = useState({})
  const [error, setError] = useState("")

  const loadTenants = async () => {
    try {
      const res = await api.get("/tenants")
      setTenants(res.data.data)
    } catch {
      setError("Failed to load tenants")
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  const startEdit = (tenant) => {
    setEditingTenantId(tenant.id)
    setForm({
      name: tenant.name,
      status: tenant.status,
      subscriptionPlan: tenant.subscription_plan,
      maxUsers: tenant.max_users,
      maxProjects: tenant.max_projects,
    })
  }

  const cancelEdit = () => {
    setEditingTenantId(null)
    setForm({})
  }

  const saveEdit = async (tenantId) => {
    try {
      await api.put(`/tenants/${tenantId}`, form)
      toast.success("Tenant updated successfully")
      setEditingTenantId(null)
      loadTenants()
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Tenant Management
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Subdomain</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Max Users</th>
                <th className="px-4 py-3 text-left">Max Projects</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tenants.map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    ) : (
                      t.name
                    )}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {t.subdomain}
                  </td>

                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={form.subscriptionPlan}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            subscriptionPlan: e.target.value,
                          })
                        }
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      t.subscription_plan
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={form.maxUsers}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            maxUsers: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      t.max_users
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={form.maxProjects}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            maxProjects: Number(e.target.value),
                          })
                        }
                      />
                    ) : (
                      t.max_projects
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="trial">Trial</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    ) : (
                      <span
                        className={
                          t.status === "active"
                            ? "text-green-600 font-medium"
                            : t.status === "trial"
                            ? "text-amber-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {t.status}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingTenantId === t.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="text-green-600 mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-slate-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(t)}
                        className="text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
