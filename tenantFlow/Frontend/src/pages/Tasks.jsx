import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { getUser } from "../auth/auth"
import { toast } from "react-toastify"

export default function Tasks() {
  const { projectId } = useParams()
  const currentUser = getUser()

  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState("")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [assignedTo, setAssignedTo] = useState("")
  const [dueDate, setDueDate] = useState("")

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks?projectId=${projectId}`)
      setTasks(res.data.data)
    } catch {
      toast.error("Failed to load tasks")
    }
  }

  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data.data.filter((u) => u.is_active))
    } catch {}
  }

  useEffect(() => {
    loadTasks()
    if (currentUser.role === "tenant_admin") {
      loadUsers()
    }
  }, [projectId])

  const createTask = async () => {
    if (!title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      })

      toast.success("Task created")
      setTitle("")
      setDescription("")
      setPriority("medium")
      setAssignedTo("")
      setDueDate("")
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed")
    }
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setForm({
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedTo || "",
      dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const saveEdit = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || null,
      })

      toast.success("Task updated")
      setEditingId(null)
      loadTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Project Tasks
        </h1>

        {currentUser.role === "tenant_admin" && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add Task</h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                className="border rounded-lg px-3 py-2"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <select
                className="border rounded-lg px-3 py-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                className="border rounded-lg px-3 py-2"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="border rounded-lg px-3 py-2"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <textarea
              className="border rounded-lg px-3 py-2 w-full mb-4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={createTask}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              Create Task
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Assigned</th>
                <th className="px-4 py-3 text-left">Due</th>
                {currentUser.role === "tenant_admin" && (
                  <th className="px-4 py-3 text-left">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {t.title}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={form.status}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">
                          In Progress
                        </option>
                        <option value="completed">
                          Completed
                        </option>
                      </select>
                    ) : (
                      <span
                        className={
                          t.status === "completed"
                            ? "text-green-600 font-medium"
                            : t.status === "in_progress"
                            ? "text-amber-600 font-medium"
                            : "text-slate-600"
                        }
                      >
                        {t.status}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={form.priority}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span
                        className={
                          t.priority === "high"
                            ? "text-red-600 font-medium"
                            : t.priority === "medium"
                            ? "text-amber-600 font-medium"
                            : "text-slate-600"
                        }
                      >
                        {t.priority}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={form.assignedTo}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            assignedTo: e.target.value,
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.full_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      t.assignedToName || "—"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <input
                        type="date"
                        className="border rounded px-2 py-1"
                        value={form.dueDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    ) : t.dueDate ? (
                      new Date(t.dueDate).toLocaleDateString()
                    ) : (
                      "—"
                    )}
                  </td>

                  {currentUser.role === "tenant_admin" && (
                    <td className="px-4 py-3">
                      {editingId !== t.id ? (
                        <button
                          onClick={() => startEdit(t)}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                      ) : (
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
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
