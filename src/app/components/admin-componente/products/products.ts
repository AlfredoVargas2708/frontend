import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  isLoading: boolean = true;
  page: number = 1;
  pageSize: number = 10;
  products: any[] = [];

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.products;
        this.isLoading = false;
        setTimeout(() => {
          this.cdr.markForCheck(); // Ensure the view is updated after loading products
        }, 1000); // Delay to simulate loading
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        setTimeout(() => {
          this.cdr.markForCheck(); // Ensure the view is updated after loading products
        }, 1000); // Delay to simulate loading
      }
    })
  }

}
