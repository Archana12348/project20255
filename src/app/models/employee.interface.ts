export interface Employee {
  id?: string
  name: string
  email: string
  position: string
  department: string
  phone: string
  joinDate: Date
  salary: number
  status: "active" | "inactive"
  assignedProjects?: string[]
}
