export const saveAuth = (token, user, expiresIn) => {
  const expiryTime = Date.now() + expiresIn * 1000
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
  localStorage.setItem("token_expiry", expiryTime.toString())
}

export const getUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  const expiry = localStorage.getItem("token_expiry")

  if (!token || !expiry) return false
  if (Date.now() > Number(expiry)) {
    logout()
    return false
  }

  return true
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("token_expiry")
  window.location.replace("/")
}
