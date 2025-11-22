import { Component } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { ProductCarousel } from '../components/product-carousel/product-carousel';

@Component({
  selector: 'app-home',
  imports: [Hero, ProductCarousel],
  templateUrl: './home.component.html',
})
export class Home {

}
