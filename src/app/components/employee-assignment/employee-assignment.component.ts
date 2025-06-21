import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { EmployeeService } from "../../services/employee.service"
import { ProjectService } from "../../services/project.service"
import { Employee } from "../../models/employee.interface"
import { Project } from "../../models/project.interface"

@Component({
  selector: "app-employee-assignment",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./employee-assignment.component.html",
  styleUrls: ["./employee-assignment.component.css"],
})
export class EmployeeAssignmentComponent implements OnInit {
  employees: Employee[] = []
  projects: Project[] = []
  assignments: any[] = []
  showModal = false
  selectedEmployee = ""
  selectedProject = ""

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  private loadData(): void {
    this.employeeService.employees$.subscribe((employees) => {
      this.employees = employees
      this.generateAssignments()
    })

    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects
      this.generateAssignments()
    })
  }

  private generateAssignments(): void {
    this.assignments = []

    this.employees.forEach((employee) => {
      if (employee.assignedProjects && employee.assignedProjects.length > 0) {
        employee.assignedProjects.forEach((projectId) => {
          const project = this.projects.find((p) => p.id === projectId)
          if (project) {
            this.assignments.push({
              employee,
              project,
              assignedDate: new Date(),
            })
          }
        })
      }
    })
  }

  openAssignModal(): void {
    this.selectedEmployee = ""
    this.selectedProject = ""
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
  }

  async assignEmployee(): Promise<void> {
    if (!this.selectedEmployee || !this.selectedProject) {
      alert("Please select both employee and project")
      return
    }

    try {
      const employee = this.employees.find((e) => e.id === this.selectedEmployee)
      const project = this.projects.find((p) => p.id === this.selectedProject)

      if (employee && project) {
        // Update employee's assigned projects
        const updatedAssignedProjects = employee.assignedProjects || []
        if (!updatedAssignedProjects.includes(this.selectedProject)) {
          updatedAssignedProjects.push(this.selectedProject)
          await this.employeeService.updateEmployee(employee.id!, {
            assignedProjects: updatedAssignedProjects,
          })
        }

        // Update project's assigned employees
        const updatedAssignedEmployees = project.assignedEmployees || []
        if (!updatedAssignedEmployees.includes(this.selectedEmployee)) {
          updatedAssignedEmployees.push(this.selectedEmployee)
          await this.projectService.updateProject(project.id!, {
            assignedEmployees: updatedAssignedEmployees,
          })
        }
      }

      this.closeModal()
    } catch (error) {
      console.error("Error assigning employee:", error)
      alert("Error assigning employee. Please try again.")
    }
  }

  async removeAssignment(employeeId: string, projectId: string): Promise<void> {
    if (confirm("Are you sure you want to remove this assignment?")) {
      try {
        const employee = this.employees.find((e) => e.id === employeeId)
        const project = this.projects.find((p) => p.id === projectId)

        if (employee && project) {
          // Remove project from employee's assigned projects
          const updatedEmployeeProjects = (employee.assignedProjects || []).filter((id) => id !== projectId)
          await this.employeeService.updateEmployee(employeeId, {
            assignedProjects: updatedEmployeeProjects,
          })

          // Remove employee from project's assigned employees
          const updatedProjectEmployees = (project.assignedEmployees || []).filter((id) => id !== employeeId)
          await this.projectService.updateProject(projectId, {
            assignedEmployees: updatedProjectEmployees,
          })
        }
      } catch (error) {
        console.error("Error removing assignment:", error)
        alert("Error removing assignment. Please try again.")
      }
    }
  }

  getAvailableEmployees(): Employee[] {
    return this.employees.filter((emp) => emp.status === "active")
  }

  getAvailableProjects(): Project[] {
    return this.projects.filter((proj) => proj.status === "planning" || proj.status === "in-progress")
  }
}
