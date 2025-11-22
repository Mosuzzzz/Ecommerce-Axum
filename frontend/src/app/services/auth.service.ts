import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

interface StoredUser {
  username: string;
  email: string;
  password: string;
  id: string;
  role: 'admin' | 'user';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private readonly USERS_STORAGE_KEY = 'registered_users';

  // Demo admin credentials
  private readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  public get isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  private getStoredUsers(): StoredUser[] {
    try {
      const users = localStorage.getItem(this.USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  private saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  register(username: string, email: string, password: string): { success: boolean; message: string } {
    const users = this.getStoredUsers();

    // Check if username already exists
    if (users.some(u => u.username === username)) {
      return { success: false, message: 'Username นี้ถูกใช้งานแล้ว' };
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email นี้ถูกใช้งานแล้ว' };
    }

    // Create new user
    const newUser: StoredUser = {
      id: this.generateUserId(),
      username,
      email,
      password, // In production, this should be hashed
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    console.log('User registered successfully:', username);
    return { success: true, message: 'สมัครสมาชิกสำเร็จ!' };
  }

  login(username: string, password: string): boolean {
    // Check admin credentials
    if (username === this.ADMIN_CREDENTIALS.username && 
        password === this.ADMIN_CREDENTIALS.password) {
      const user: User = { 
        id: 'admin',
        username, 
        email: 'admin@eshop.com',
        role: 'admin',
        createdAt: new Date()
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      console.log('Admin logged in successfully');
      return true;
    }

    // Check regular users
    const users = this.getStoredUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      const user: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        createdAt: new Date(foundUser.createdAt)
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      console.log('User logged in successfully:', username);
      return true;
    }

    console.error('Invalid credentials');
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
