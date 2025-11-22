import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  standalone: true,
})
export class Register {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.error = '';

    // Validation
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password ไม่ตรงกัน';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password ต้องมีอย่างน้อย 6 ตัวอักษร';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'รูปแบบ Email ไม่ถูกต้อง';
      return;
    }

    this.loading = true;

    // Simulate async registration
    setTimeout(() => {
      const result = this.authService.register(this.username, this.email, this.password);
      
      if (result.success) {
        // Redirect to login
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'true' } 
        });
      } else {
        this.error = result.message;
        this.loading = false;
      }
    }, 500);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
