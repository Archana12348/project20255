import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { EmployeeService } from "../../services/employee.service"
import { ProjectService } from "../../services/project.service"
import { Employee } from "../../models/employee.interface"
import { Project } from "../../models/project.interface"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = []
  projects: Project[] = []

  stats = {
    totalEmployees: 0,
    activeEmployees: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
  }

  recentEmployees: Employee[] = []
  recentProjects: Project[] = []

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  private loadDashboardData(): void {
    this.employeeService.employees$.subscribe((employees) => {
      this.employees = employees
      this.updateEmployeeStats()
      this.recentEmployees = employees.slice(0, 5)
    })

    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects
      this.updateProjectStats()
      this.recentProjects = projects.slice(0, 5)
    })
  }

  private updateEmployeeStats(): void {
    this.stats.totalEmployees = this.employees.length
    this.stats.activeEmployees = this.employees.filter((emp) => emp.status === "active").length
  }

  private updateProjectStats(): void {
    this.stats.totalProjects = this.projects.length
    this.stats.activeProjects = this.projects.filter((proj) => proj.status === "in-progress").length
    this.stats.completedProjects = this.projects.filter((proj) => proj.status === "completed").length
  }
}
