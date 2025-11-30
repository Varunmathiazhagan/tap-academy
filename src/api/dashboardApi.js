import axiosClient from './axiosClient'

export const dashboardApi = {
  employee() {
    return axiosClient.get('/dashboard/employee')
  },
  manager() {
    return axiosClient.get('/dashboard/manager')
  },
}
