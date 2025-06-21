import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { importProvidersFrom } from "@angular/core"
import { FormsModule } from "@angular/forms"

import { AppComponent } from "./app/app.component"
import { routes } from "./app/app.routes"
import { provideAnimations } from "@angular/platform-browser/animations"

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), importProvidersFrom(FormsModule), provideAnimations(),],
}).catch((err) => console.error(err))
