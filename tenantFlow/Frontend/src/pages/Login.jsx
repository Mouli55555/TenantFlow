import { useState } from "react"
import api from "../api/api"
import { saveAuth } from "../auth/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tenantSubdomain, setTenantSubdomain] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        tenantSubdomain: tenantSubdomain || undefined,
      })

      saveAuth(res.data.data.token, res.data.data.user)
      const user = res.data.data.user

      if (user.role === "super_admin") {
        window.location.href = "/tenants"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Sign in to continue to TenantFlow
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tenant subdomain (optional)"
          value={tenantSubdomain}
          onChange={(e) => setTenantSubdomain(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-slate-600 mt-6">
          New organization?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  )
}
