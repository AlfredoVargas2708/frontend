import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { cantidadDecimalSiPesableValidator } from '../../validators/cantidadDecimal';
import { ProductsService } from '../../services/products.service';
import { filter, first, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-employee-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.scss'
})
export class EmployeeComponent implements AfterViewInit {

  productForm: FormGroup;
  saleForm: FormGroup;

  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cantInput') cantInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private productService: ProductsService) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      product: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      cant: [null, [Validators.required, Validators.min(0)]],
      pesable: [false],
    }, {
      validators: [cantidadDecimalSiPesableValidator]
    })
    this.saleForm = this.fb.group({
      id: [null],
      date: [new Date()],
      total: [0],
      products: this.fb.array([]) // Aquí puedes inicializar un FormArray si es necesario
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.codeInput.nativeElement.focus(), 100);
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
        setTimeout(() => {
          this.cantInput.nativeElement.focus();
        }, 100);
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    })
  }

  verificarCantidad(event: any) {
    const cant = event.target.value;
    const esPesable = this.productForm.get('pesable')?.value;

    if (esPesable && cant.length === 4) {
      this.productForm.patchValue({
        cant: parseFloat(cant)
      });
      this.addProductToSale(); // Agrega automáticamente
    } else if (!esPesable) {
      const cantidad = parseInt(cant, 10);
      this.productForm.patchValue({
        cant: cantidad
      });

      // Escucha el cambio para valores válidos y agrega
      this.productForm.get('cant')?.valueChanges.pipe(
        debounceTime(300),
        filter(value => !isNaN(value) && value > 0),
        first()
      ).subscribe(() => {
        this.addProductToSale(); // Agrega automáticamente
      });
    }
  }


  addProductToSale() {
    const product = this.productForm.value;

    // Evita agregar si el formulario es inválido
    if (this.productForm.invalid) return;

    const productsArray = this.saleForm.get('products') as FormArray;

    productsArray.push(this.fb.group({
      code: [product.code],
      product: [product.product],
      price: [product.price],
      cant: [product.cant],
      pesable: [product.pesable]
    }));

    // Reinicia el productForm después de agregarlo
    setTimeout(() => {
      this.productForm.reset({
        code: '',
        product: '',
        price: 0,
        cant: 0,
        pesable: false
      });
    }, 1000);

    // Actualiza el total de la venta
    this.updateTotal();
  }

  updateTotal() {
    const productsArray = this.saleForm.get('products') as FormArray;
    let total = 0;

    productsArray.controls.forEach(control => {
      const product = control.value;
      total += product.price * product.cant;
    });

    this.saleForm.patchValue({ total: total });
  }

}
