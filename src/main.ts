import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Components
import { NavbarComponent } from './components/navbar.component';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { JobListComponent } from './components/job-list.component';
import { JobDetailComponent } from './components/job-detail.component';
import { MyApplicationsComponent } from './components/my-applications.component';
import { AdminJobsComponent } from './components/admin/admin-jobs.component';
import { AdminApplicationsComponent } from './components/admin/admin-applications.component';
import { UnauthorizedComponent } from './components/unauthorized.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'jobs/:id', component: JobDetailComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'my-applications', component: MyApplicationsComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'admin/jobs', component: AdminJobsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/applications', component: AdminApplicationsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});