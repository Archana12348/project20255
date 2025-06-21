export interface User {
  uid: string
  email: string
  role: "super-admin" | "employee"
  displayName?: string
}
