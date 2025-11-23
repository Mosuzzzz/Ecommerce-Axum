import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  savedAddress?: UserAddress;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface StoredUser {
  username: string;
  email: string;
  password: string;
  id: string;
  role: 'admin' | 'user';
  createdAt: string;
  savedAddress?: UserAddress;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private readonly USERS_STORAGE_KEY = 'registered_users';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'currentUser';

  // Demo admin credentials
  private readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  constructor() {
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Check token validity on init
    this.checkTokenValidity();
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
    let user: User | null = null;

    // Check admin credentials
    if (username === this.ADMIN_CREDENTIALS.username && 
        password === this.ADMIN_CREDENTIALS.password) {
      user = { 
        id: 'admin',
        username, 
        email: 'admin@eshop.com',
        role: 'admin',
        createdAt: new Date()
      };
    } else {
      // Check regular users
      const users = this.getStoredUsers();
      const foundUser = users.find(u => u.username === username && u.password === password);

      if (foundUser) {
        user = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role,
          createdAt: new Date(foundUser.createdAt)
        };
      }
    }

    if (user) {
      // Generate tokens
      const tokens = this.generateTokens(user);
      
      // Store user and tokens
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      
      this.currentUserSubject.next(user);
      console.log('User logged in successfully:', username);
      return true;
    }

    console.error('Invalid credentials');
    return false;
  }

  logout(): void {
    const userId = this.currentUserValue?.id;
    
    // Clear user cart when logging out
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  refreshAccessToken(): boolean {
    const refreshToken = this.getRefreshToken();
    const user = this.currentUserValue;

    if (!refreshToken || !user) {
      return false;
    }

    // Verify refresh token (in production, this would be a backend call)
    if (this.verifyToken(refreshToken)) {
      const newTokens = this.generateTokens(user);
      localStorage.setItem(this.TOKEN_KEY, newTokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, newTokens.refreshToken);
      console.log('Access token refreshed');
      return true;
    }

    // Refresh token invalid, logout user
    this.logout();
    return false;
  }

  private generateTokens(user: User): AuthTokens {
    // In production, tokens would be generated by backend
    // This is a mock implementation
    const accessToken = this.createMockToken(user, 3600); // 1 hour
    const refreshToken = this.createMockToken(user, 604800); // 7 days
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }

  private createMockToken(user: User, expiresIn: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn
    }));
    const signature = btoa(`mock_signature_${user.id}_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  private verifyToken(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  private checkTokenValidity(): void {
    const token = this.getAccessToken();
    
    if (token && !this.verifyToken(token)) {
      // Token expired, try to refresh
      if (!this.refreshAccessToken()) {
        // Refresh failed, logout
        this.logout();
      }
    }
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Address Management Methods
  saveUserAddress(address: UserAddress): boolean {
    const user = this.currentUserValue;
    if (!user) {
      console.error('No user logged in');
      return false;
    }

    try {
      // Update current user
      const updatedUser = { ...user, savedAddress: address };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      // Update in users list if not admin
      if (user.role !== 'admin') {
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex > -1) {
          users[userIndex].savedAddress = address;
          this.saveUsers(users);
        }
      }

      console.log('Address saved successfully for user:', user.username);
      return true;
    } catch (error) {
      console.error('Error saving address:', error);
      return false;
    }
  }

  getUserAddress(): UserAddress | null {
    const user = this.currentUserValue;
    return user?.savedAddress || null;
  }

  clearUserAddress(): boolean {
    const user = this.currentUserValue;
    if (!user) {
      return false;
    }

    try {
      // Update current user
      const updatedUser = { ...user, savedAddress: undefined };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      // Update in users list if not admin
      if (user.role !== 'admin') {
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex > -1) {
          delete users[userIndex].savedAddress;
          this.saveUsers(users);
        }
      }

      console.log('Address cleared for user:', user.username);
      return true;
    } catch (error) {
      console.error('Error clearing address:', error);
      return false;
    }
  }
}
