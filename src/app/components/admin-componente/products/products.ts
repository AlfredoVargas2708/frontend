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
  totalItems: number = 0;
  totalPages: number = 0;
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;
  products: any[] = [];
  activeView: string = 'list'; // Default view is 'list'

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productsService.getProducts(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalItems = data.pagination.totalItems;
        this.totalPages = data.pagination.totalPages;
        this.hasNextPage = data.pagination.hasNextPage;
        this.hasPrevPage = data.pagination.hasPrevPage;
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

  changeView(view: string) {
    this.activeView = view;
    this.cdr.markForCheck(); // Ensure the view is updated when changing views
  }

  get visiblePages(): (number | 'dots')[] {
    const pages: (number | 'dots')[] = [];
    const total = this.totalPages;
    const current = this.page;

    if (total <= 5) {
      // Mostrar todo si hay pocas páginas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Siempre mostrar la primera

      if (current > 3) {
        pages.push('dots');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i);
        }
      }

      if (current < total - 2) {
        pages.push('dots');
      }

      pages.push(total); // Siempre mostrar la última
    }

    return pages;
  }


  nextPage() {
    if (this.hasNextPage) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.hasPrevPage) {
      this.page--;
      this.loadProducts();
    }
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.loadProducts();
    }
  }

}
