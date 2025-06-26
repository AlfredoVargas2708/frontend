import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products implements OnInit {
  products: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  productId: number = 0;

  addProductForm: FormGroup;
  editProductForm: FormGroup;

  constructor(private productsService: ProductsService, private cdr: ChangeDetectorRef, private fb: FormBuilder) {
    this.addProductForm = this.fb.group({
      id: [''],
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productImage: ['', Validators.required],
      productLink: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
    this.editProductForm = this.fb.group({
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.min(0)]],
      productImage: ['', Validators.required],
      productLink: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit() {
    this.loadProducts(this.page, this.pageSize);
  }

  loadProducts(page: number, pageSize: number) {
    this.productsService.getProducts(page, pageSize).subscribe({
      next: (data) => {
        this.products = data.data.products;
        this.totalPages = data.data.pagination.totalPages;
        this.page = data.data.pagination.currentPage;

        console.log('Products loaded:', this.products);

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

  agregarProducto() {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;
      this.productsService.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Producto agregado:', response);
          this.loadProducts(this.page, this.pageSize); // Reload products after adding
          this.addProductForm.reset(); // Reset the form
        },
        error: (error) => {
          console.error('Error al agregar producto:', error);
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }

  editProduct(product: any) {
    this.productId = product.product_id; // Store the product ID for later use
    this.editProductForm.patchValue({
      productCode: product.product_code,
      productName: product.product_name,
      productPrice: product.product_price,
      productImage: product.product_image,
      productLink: product.product_link
    });
  }

  updateProduct() {
    if (this.editProductForm.valid) {
      const productData = this.editProductForm.value;
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts(this.page, this.pageSize); // Reload products after updating
          this.editProductForm.reset(); // Reset the form
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }
}
