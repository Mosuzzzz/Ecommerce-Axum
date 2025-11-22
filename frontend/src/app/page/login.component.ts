import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
})
export class Login implements OnInit {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  registeredSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      if (this.authService.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  ngOnInit() {
    // Check if redirected from registration
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.registeredSuccess = true;
      }
    });
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error = 'กรุณากรอก Username และ Password';
      return;
    }

    this.loading = true;
    this.error = '';

    // Simulate async login
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (success) {
        // Redirect based on role
        if (this.authService.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.error = 'Username หรือ Password ไม่ถูกต้อง';
        this.loading = false;
      }
    }, 500);
  }
}
