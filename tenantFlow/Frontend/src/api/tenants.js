import api from "./api"

export const updateTenant = async (tenantId, data) => {
  const res = await api.put(`/tenants/${tenantId}`, data)
  return res.data
}
