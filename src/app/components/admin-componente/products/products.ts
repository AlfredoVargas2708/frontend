import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  products: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private productsService: ProductsService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadProducts(this.page, this.pageSize);
  }

  loadProducts(page: number, pageSize: number) {
    this.productsService.getProducts(page, pageSize).subscribe({
      next: (data) => {
        this.products = data.data.products;
        this.totalPages = data.data.pagination.totalPages;
        this.page = data.data.pagination.currentPage;

        this.cdr.markForCheck(); // Ensure the view is updated after data is loaded
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) {
      return; // Invalid page number
    }
    this.page = newPage;
    console.log('Changing to page:', this.page);
    this.loadProducts(this.page, this.pageSize);
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  getDisplayedPages(): number[] {
    const displayedPages = [];
    const pagesToShow = 2; // Puedes ajustar este número (2 muestra 2 páginas a cada lado)

    // Página inicial y final del rango
    let startPage = Math.max(1, this.page - pagesToShow);
    let endPage = Math.min(this.totalPages, this.page + pagesToShow);

    // Ajustar si estamos cerca del inicio
    if (this.page - pagesToShow <= 1) {
      endPage = Math.min(1 + (pagesToShow * 2), this.totalPages);
    }

    // Ajustar si estamos cerca del final
    if (this.page + pagesToShow >= this.totalPages) {
      startPage = Math.max(1, this.totalPages - (pagesToShow * 2));
    }

    // Generar el array de páginas a mostrar
    for (let i = startPage; i <= endPage; i++) {
      displayedPages.push(i);
    }

    return displayedPages;
  }
}
