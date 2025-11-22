import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { LanguageService, Language } from '../../services/language.service';
import { Router } from '@angular/router';
import { CartDrawer } from '../cart-drawer/cart-drawer';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @ViewChild(CartDrawer) cartDrawer!: CartDrawer;
  cartCount: number = 0;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public langService: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openCart(): void {
    const event = new CustomEvent('openCart');
    window.dispatchEvent(event);
  }

  switchLanguage(lang: Language): void {
    this.langService.setLanguage(lang);
  }

  t(key: string): string {
    return this.langService.translate(key);
  }
}
