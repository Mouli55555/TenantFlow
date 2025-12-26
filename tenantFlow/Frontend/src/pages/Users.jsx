import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify"
import { getUser } from "../auth/auth"

export default function Users() {
  const currentUser = getUser()

  const [users, setUsers] = useState([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data.data)
    } catch {
      toast.error("Failed to load users")
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async () => {
    if (!email || !password || !fullName) {
      toast.error("All fields are required")
      return
    }

    try {
      await api.post("/users", {
        email,
        password,
        fullName,
        role: "user",
      })

      setEmail("")
      setPassword("")
      setFullName("")
      toast.success("User created successfully")
      loadUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed")
    }
  }

  const startEdit = (u) => {
    setEditingId(u.id)
    setForm({
      fullName: u.full_name,
      role: u.role,
      isActive: u.is_active ? "true" : "false",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const saveEdit = async (userId) => {
    try {
      await api.put(`/users/${userId}`, {
        fullName: form.fullName,
        role:
          currentUser.role === "tenant_admin" ? form.role : undefined,
        isActive:
          currentUser.role === "tenant_admin" &&
          currentUser.userId !== userId
            ? form.isActive === "true"
            : undefined,
      })

      toast.success("User updated successfully")
      setEditingId(null)
      loadUsers()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Tenant admins cannot deactivate themselves"
      )
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Users
        </h1>

        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Add New User
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="border rounded-lg px-3 py-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={createUser}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Create User
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const isSelf = currentUser.userId === u.id
                const canEdit =
                  currentUser.role === "tenant_admin" || isSelf

                return (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      {editingId === u.id ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={form.fullName}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              fullName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        u.full_name
                      )}
                    </td>

                    <td className="px-4 py-3">{u.email}</td>

                    <td className="px-4 py-3">
                      {editingId === u.id &&
                      currentUser.role === "tenant_admin" ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={form.role}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="user">User</option>
                          <option value="tenant_admin">
                            Tenant Admin
                          </option>
                        </select>
                      ) : (
                        u.role
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {editingId === u.id &&
                      currentUser.role === "tenant_admin" &&
                      !isSelf ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={form.isActive}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              isActive: e.target.value,
                            })
                          }
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : u.is_active ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {canEdit && editingId !== u.id && (
                        <button
                          onClick={() => startEdit(u)}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                      )}

                      {editingId === u.id && (
                        <>
                          <button
                            onClick={() => saveEdit(u.id)}
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
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
