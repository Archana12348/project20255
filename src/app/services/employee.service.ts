import { Injectable } from "@angular/core"
import { collection, addDoc,getDocs,doc,updateDoc,deleteDoc,query,orderBy,getDoc,where} from "firebase/firestore"
import { db } from "../../app/config/firebase.config"
import type { Employee } from "../models/employee.interface"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([])
  public employees$ = this.employeesSubject.asObservable()

  constructor() {
    this.loadEmployees()
  }

  // 📌 Load all employees from Firestore
  async loadEmployees(): Promise<void> {
    try {
      const q = query(collection(db, "employees"), orderBy("name"))
      const querySnapshot = await getDocs(q)
      const employees: Employee[] = []

      querySnapshot.forEach((docItem) => {
        employees.push({ id: docItem.id, ...docItem.data() } as Employee)
      })

      this.employeesSubject.next(employees)
    } catch (error) {
      console.error("Error loading employees:", error)
    }
  }

  // 📌 Add new employee to Firestore
  async addEmployee(employee: Omit<Employee, "id">): Promise<void> {
    try {
      await addDoc(collection(db, "employees"), {
        ...employee,
        role: "employee",
        createdAt: new Date()
      })
      this.loadEmployees()
    } catch (error) {
      console.error("Error adding employee:", error)
      throw error
    }
  }

  // 📌 Update employee data
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      const employeeRef = doc(db, "employees", id)
      await updateDoc(employeeRef, employee)
      this.loadEmployees()
    } catch (error) {
      console.error("Error updating employee:", error)
      throw error
    }
  }

  // 📌 Delete employee
  async deleteEmployee(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "employees", id))
      this.loadEmployees()
    } catch (error) {
      console.error("Error deleting employee:", error)
      throw error
    }
  }

  // 📌 Get single employee by email (future login verification use)
  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    try {
      const q = query(collection(db, "employees"), where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return null
      }

      const docItem = querySnapshot.docs[0]
      return { id: docItem.id, ...docItem.data() } as Employee
    } catch (error) {
      console.error("Error fetching employee by email:", error)
      return null
    }
  }
}
