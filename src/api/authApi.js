import axiosClient from './axiosClient'

export const authApi = {
  register(payload) {
    return axiosClient.post('/auth/register', payload)
  },
  login(payload) {
    return axiosClient.post('/auth/login', payload)
  },
  me() {
    return axiosClient.get('/auth/me')
  },
  logout() {
    return axiosClient.post('/auth/logout')
  },
}
