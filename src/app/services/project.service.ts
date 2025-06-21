import { Injectable } from "@angular/core"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "../config/firebase.config"
import type { Project } from "../models/project.interface"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([])
  public projects$ = this.projectsSubject.asObservable()

  constructor() {
    this.loadProjects()
  }

  async loadProjects(): Promise<void> {
    try {
      const q = query(collection(db, "projects"), orderBy("name"))
      const querySnapshot = await getDocs(q)
      const projects: Project[] = []

      querySnapshot.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as Project)
      })

      this.projectsSubject.next(projects)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  async addProject(project: Omit<Project, "id">): Promise<void> {
    try {
      await addDoc(collection(db, "projects"), project)
      this.loadProjects()
    } catch (error) {
      console.error("Error adding project:", error)
      throw error
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    try {
      const projectRef = doc(db, "projects", id)
      await updateDoc(projectRef, project)
      this.loadProjects()
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "projects", id))
      this.loadProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  }
}
