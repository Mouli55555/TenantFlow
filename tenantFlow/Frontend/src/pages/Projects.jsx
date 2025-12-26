import { useEffect, useState } from "react"
import api from "../api/api"
import { getUser } from "../auth/auth"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function Projects() {
  const navigate = useNavigate()
  const currentUser = getUser()

  const [projects, setProjects] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects")
      setProjects(res.data.data)
    } catch {
      toast.error("Failed to load projects")
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const createProject = async () => {
    if (!name) {
      toast.error("Project name is required")
      return
    }
    try {
      await api.post("/projects", { name, description })
      setName("")
      setDescription("")
      toast.success("Project created")
      loadProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed")
    }
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description || "",
      status: p.status,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const saveEdit = async (id) => {
    try {
      await api.put(`/projects/${id}`, form)
      toast.success("Project updated")
      setEditingId(null)
      loadProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed")
    }
  }

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success("Project deleted")
      loadProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
        </div>

        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="font-semibold text-slate-700 mb-4">
              Create New Project
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                onClick={createProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
              >
                Add Project
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Description</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => {
                const canEdit =
                  currentUser.role === "tenant_admin" ||
                  currentUser.userId === p.created_by

                return (
                  <tr key={p.id} className="border-t hover:bg-slate-50">
                    <td className="px-6 py-3">
                      {editingId === p.id ? (
                        <input
                          className="border px-2 py-1 rounded w-full"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                        />
                      ) : (
                        <span
                          onClick={() => navigate(`/projects/${p.id}`)}
                          className="text-indigo-600 font-medium cursor-pointer hover:underline"
                        >
                          {p.name}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-slate-600">
                      {editingId === p.id ? (
                        <input
                          className="border px-2 py-1 rounded w-full"
                          value={form.description}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.description || "—"
                      )}
                    </td>

                    <td className="px-6 py-3">
                      {editingId === p.id ? (
                        <select
                          className="border px-2 py-1 rounded"
                          value={form.status}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      ) : (
                        <span className="capitalize text-slate-700">
                          {p.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-right">
                      {canEdit && editingId !== p.id && (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="text-indigo-600 mr-4 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProject(p.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {editingId === p.id && (
                        <>
                          <button
                            onClick={() => saveEdit(p.id)}
                            className="text-green-600 mr-4 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-slate-500 hover:underline"
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
