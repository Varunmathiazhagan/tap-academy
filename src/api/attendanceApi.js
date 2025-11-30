import axiosClient from './axiosClient'

export const attendanceApi = {
  checkIn() {
    return axiosClient.post('/attendance/checkin')
  },
  checkOut() {
    return axiosClient.post('/attendance/checkout')
  },
  getMyHistory(params) {
    return axiosClient.get('/attendance/my-history', { params })
  },
  getMySummary(params) {
    return axiosClient.get('/attendance/my-summary', { params })
  },
  getToday() {
    return axiosClient.get('/attendance/today')
  },
  managerGetAll(params) {
    return axiosClient.get('/attendance/all', { params })
  },
  managerGetEmployee(id) {
    return axiosClient.get(`/attendance/employee/${id}`)
  },
  managerSummary(params) {
    return axiosClient.get('/attendance/summary', { params })
  },
  managerTodayStatus() {
    return axiosClient.get('/attendance/today-status')
  },
  exportCsv(params) {
    return axiosClient.get('/attendance/export', { params, responseType: 'blob' })
  },
}

export const userApi = {
  getAllEmployees() {
    return axiosClient.get('/users')
  },
  getUserById(id) {
    return axiosClient.get(`/users/${id}`)
  },
}
