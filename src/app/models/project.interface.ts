export interface Project {
  id?: string
  name: string
  description: string
  clientName: string
  startDate: Date
  endDate: Date
  status: "planning" | "in-progress" | "completed" | "on-hold"
  assignedEmployees?: string[]
  budget: number
}

