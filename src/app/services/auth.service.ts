import { Injectable } from "@angular/core"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../config/firebase.config"
import { BehaviorSubject } from "rxjs"
import { Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private router: Router) {
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user)
    })
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        this.router.navigate(["/dashboard"])
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // ✅ Google Login Method
  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      if (result.user) {
        this.router.navigate(["/dashboard"])
        return true
      }
      return false
    } catch (error) {
      console.error("Google Sign-in error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth)
      this.router.navigate(["/login"])
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }
}
