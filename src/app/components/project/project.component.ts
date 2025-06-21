import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ProjectService } from "../../services/project.service"
import { Project } from "../../models/project.interface"

@Component({
  selector: "app-project",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
  projects: Project[] = []
  filteredProjects: Project[] = []
  searchTerm = ""
  showModal = false
  isEditing = false
  currentProject: Partial<Project> = {}

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.projects$.subscribe((projects) => {
      this.projects = projects
      this.filteredProjects = projects
    })
  }

  filterProjects(): void {
    if (!this.searchTerm) {
      this.filteredProjects = this.projects
    } else {
      this.filteredProjects = this.projects.filter(
        (proj) =>
          proj.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          proj.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          proj.status.toLowerCase().includes(this.searchTerm.toLowerCase()),
      )
    }
  }

  openAddModal(): void {
    this.isEditing = false
    this.currentProject = {
      name: "",
      description: "",
      clientName: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "planning",
      budget: 0,
    }
    this.showModal = true
  }

  openEditModal(project: Project): void {
    this.isEditing = true
    this.currentProject = { ...project }
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    this.currentProject = {}
  }

  async saveProject(): Promise<void> {
    try {
      if (this.isEditing && this.currentProject.id) {
        await this.projectService.updateProject(this.currentProject.id, this.currentProject)
      } else {
        await this.projectService.addProject(this.currentProject as Omit<Project, "id">)
      }
      this.closeModal()
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Error saving project. Please try again.")
    }
  }

  async deleteProject(id: string): Promise<void> {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await this.projectService.deleteProject(id)
      } catch (error) {
        console.error("Error deleting project:", error)
        alert("Error deleting project. Please try again.")
      }
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "planning":
        return "#3498db"
      case "in-progress":
        return "#f39c12"
      case "completed":
        return "#27ae60"
      case "on-hold":
        return "#e74c3c"
      default:
        return "#95a5a6"
    }
  }
}
