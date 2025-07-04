import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.scss'
})
export class Sales {
  filterOptions = [
    { value: 'fecha', label: '📅 Fecha' },
    { value: 'fecha-vendido-asc', label: '⬆️ Vendido Ascendente' },
    { value: 'fecha-vendido-desc', label: '⬇️ Vendido Descendente' },
    { value: 'producto', label: '📦 Producto' },
  ];

  selectedFilter = '';
  selectedProduct: string | null = null;
  filteredProducts: any[] = [];

  constructor(
    private productService: ProductsService,
    private cdr: ChangeDetectorRef
  ) { }

  changeFilter(event: any) {
    this.selectedFilter = event.target.value;
  }

  searchProducts(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length > 0) {
      this.productService.getProductByName(searchTerm).subscribe({
        next: (response: any) => {
          this.filteredProducts = response;
          this.cdr.markForCheck(); // Ensure the view updates with the new filtered products
        },
        error: (error: any) => {
          console.error('Error fetching products:', error);
          this.filteredProducts = [];
          this.cdr.markForCheck(); // Ensure the view updates even on error
        }
      });
    } else {
      this.filteredProducts = [];
    }
  }

  selectProduct(product: string) {
    this.selectedProduct = product;
    this.filteredProducts = [];
  }
}
