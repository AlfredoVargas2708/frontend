import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cantidadDecimalSiPesableValidator } from '../../validators/cantidadDecimal';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-employee-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.scss'
})
export class EmployeeComponent {

  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductsService) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      product: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      cant: [0, [Validators.required, Validators.min(0)]],
      pesable: [false],
    }, {
      validators: [cantidadDecimalSiPesableValidator]
    })
  }

  getProduct(event: any) {
    const code = event.target.value;
    this.productService.getProduct(code).subscribe({
      next: (data) => {
        this.productForm.patchValue({
          code: data.product_code,
          product: data.product_name,
          price: data.product_price,
          pesable: data.is_weighable,
        })
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    })
  }
}
