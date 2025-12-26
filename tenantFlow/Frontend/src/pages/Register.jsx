import { useState } from "react"
import api from "../api/api"

export default function Register() {
  const [tenantName, setTenantName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [adminName, setAdminName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await api.post("/auth/register-tenant", {
        tenantName,
        subdomain,
        adminFullName: adminName,
        adminEmail: email,
        adminPassword: password,
      })
      setMessage("Organization created successfully. Please login.")
      setError("")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Create your organization
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Start managing projects and teams
        </p>

        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Organization Name"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
          required
        />

        <div className="flex mb-3">
          <input
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />
          <span className="px-3 py-2 border border-l-0 rounded-r-lg bg-slate-100 text-slate-600 text-sm flex items-center">
            .yourapp.com
          </span>
        </div>

        <input
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Admin Full Name"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          required
        />

        <input
          type="email"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Create Organization
        </button>

        <p className="text-sm text-center text-slate-600 mt-6">
          Already have an account?{" "}
          <a href="/" className="text-indigo-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}
