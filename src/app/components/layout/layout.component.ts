import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { User } from "firebase/auth"

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null
  isSidebarOpen = true

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
}
