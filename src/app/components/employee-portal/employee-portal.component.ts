import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { EmployeeService } from "../../services/employee.service"
import { Employee } from "../../models/employee.interface"
import { auth } from "../../config/firebase.config"
import { createUserWithEmailAndPassword } from "firebase/auth"

@Component({
  selector: "app-employee-portal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./employee-portal.component.html",
  styleUrls: ["./employee-portal.component.css"],
})
export class EmployeePortalComponent implements OnInit {
  employees: Employee[] = []
  filteredEmployees: Employee[] = []
  searchTerm = ""
  showModal = false
  isEditing = false
  currentEmployee: Partial<Employee & { password?: string }> = {}

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((employees) => {
      this.employees = employees
      this.filteredEmployees = employees
    })
  }

  filterEmployees(): void {
    if (!this.searchTerm) {
      this.filteredEmployees = this.employees
    } else {
      const term = this.searchTerm.toLowerCase()
      this.filteredEmployees = this.employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term)
      )
    }
  }

  openAddModal(): void {
    this.isEditing = false
    this.currentEmployee = {
      name: "",
      email: "",
      position: "",
      department: "",
      phone: "",
      joinDate: new Date(),
      salary: 0,
      status: "active",
      password: "" // password field bhi include
    }
    this.showModal = true
  }

  openEditModal(employee: Employee): void {
    this.isEditing = true
    this.currentEmployee = { ...employee }
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    this.currentEmployee = {}
  }

  async saveEmployee(): Promise<void> {
    try {
      // Validation check
      if (!this.currentEmployee.name || !this.currentEmployee.email) {
        alert("Please fill in all required fields.")
        return
      }

      if (this.isEditing && this.currentEmployee.id) {
        // Update existing employee
        await this.employeeService.updateEmployee(
          this.currentEmployee.id,
          this.currentEmployee
        )
      } else {
        // Add new employee to Firebase Auth first
        if (!this.currentEmployee.password) {
          alert("Please enter a password for the new employee.")
          return
        }

        await createUserWithEmailAndPassword(
          auth,
          this.currentEmployee.email!,
          this.currentEmployee.password
        )

        // Then add employee to Firestore
        await this.employeeService.addEmployee(
          this.currentEmployee as Omit<Employee, "id">
        )
      }

      this.closeModal()
    } catch (error: any) {
      console.error("Error saving employee:", error)
      alert(error.message || "Error saving employee. Please try again.")
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await this.employeeService.deleteEmployee(id)
      } catch (error) {
        console.error("Error deleting employee:", error)
        alert("Error deleting employee. Please try again.")
      }
    }
  }
}
