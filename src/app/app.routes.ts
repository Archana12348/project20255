import type { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { LayoutComponent } from "./components/layout/layout.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { EmployeePortalComponent } from "./components/employee-portal/employee-portal.component"
import { ProjectComponent } from "./components/project/project.component"
import { EmployeeAssignmentComponent } from "./components/employee-assignment/employee-assignment.component"
import { AuthGuard } from "./guards/auth.guard"


export const routes: Routes = [
  // Public Routes
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  

  // Admin Routes (superadmin role-only guarded)
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },               // Superadmin Dashboard
      { path: "employees", component: EmployeePortalComponent },          // Employee Management
      { path: "projects", component: ProjectComponent },                  // Projects Management
      { path: "assignments", component: EmployeeAssignmentComponent },    // Employee Assignments
    ],
  },



  // Catch-All
  { path: "**", redirectTo: "/login" },
]
