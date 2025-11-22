import { Component, signal, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawer } from "./components/cart-drawer/cart-drawer";
import { Footer } from "./components/footer/footer";
import { Navbar } from "./components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [CartDrawer, Footer, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  @ViewChild(CartDrawer) cartDrawer!: CartDrawer;

  ngOnInit() {
    // Listen for cart open events
    window.addEventListener('openCart', () => {
      if (this.cartDrawer) {
        this.cartDrawer.openDrawer();
      }
    });
  }
}
