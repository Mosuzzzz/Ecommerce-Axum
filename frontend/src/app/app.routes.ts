import { Routes } from '@angular/router';
import { Home } from './page/home.component';
import { Admin } from './page/admin.component';
import { Login } from './page/login.component';
import { Register } from './page/register.component';
import { Products } from './page/products.component';
import { ProductDetail } from './page/product-detail.component';
import { Checkout } from './page/checkout.component';
import { Orders } from './page/orders.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: Orders },
  { 
    path: 'admin', 
    component: Admin,
    canActivate: [adminGuard]
  }
];
