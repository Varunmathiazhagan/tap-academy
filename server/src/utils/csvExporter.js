import { createObjectCsvStringifier } from 'csv-writer'

export function buildAttendanceCsv(records) {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'employeeId', title: 'Employee ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'department', title: 'Department' },
      { id: 'date', title: 'Date' },
      { id: 'checkInTime', title: 'Check In' },
      { id: 'checkOutTime', title: 'Check Out' },
      { id: 'status', title: 'Status' },
      { id: 'totalHours', title: 'Total Hours' },
    ],
  })

  const rows = records.map((record) => ({
    employeeId: record.user.employeeId,
    name: record.user.name,
    email: record.user.email,
    department: record.user.department,
    date: new Date(record.date).toISOString(),
    checkInTime: record.checkInTime ? new Date(record.checkInTime).toISOString() : '',
    checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toISOString() : '',
    status: record.status,
    totalHours: record.totalHours ?? 0,
  }))

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(rows)
}
