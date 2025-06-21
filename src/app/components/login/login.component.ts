import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = ""
  password = ""
  isLoading = false
  errorMessage = ""

  constructor(private authService: AuthService) {}

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = "Please fill in all fields"
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    try {
      await this.authService.login(this.email, this.password)
    } catch (error: any) {
      this.errorMessage = error.message || "Login failed. Please try again."
    } finally {
      this.isLoading = false
    }
  }

  async onGoogleSignIn(): Promise<void> {
    this.isLoading = true
    this.errorMessage = ""

    try {
      await this.authService.loginWithGoogle()
    } catch (error: any) {
      this.errorMessage = error.message || "Google sign-in failed."
    } finally {
      this.isLoading = false
    }
  }
}
