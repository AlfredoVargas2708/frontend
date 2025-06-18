import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { cantidadDecimalSiPesableValidator } from '../../validators/cantidadDecimal';
import { ProductsService } from '../../services/products.service';
import { filter, first, debounceTime } from 'rxjs/operators';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-employee-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.scss'
})
export class EmployeeComponent implements AfterViewInit {

  productForm: FormGroup;
  saleForm: FormGroup;
  editProductForm: FormGroup;
  cantidadVentas: number = 0;

  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cantInput') cantInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private productService: ProductsService, private salesService: SalesService) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      product: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      cant: [null, [Validators.required, Validators.min(0)]],
      pesable: [false],
    }, {
      validators: [cantidadDecimalSiPesableValidator]
    })
    this.editProductForm = this.fb.group({
      code: ['', Validators.required],
      product: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      cant: [null, [Validators.required, Validators.min(0)]],
    })
    this.salesService.getCantidadVentas().subscribe({
      next: (cantidad) => {
        this.cantidadVentas = cantidad;
      },
      error: (err) => {
        console.error('Error fetching sales count:', err);
      }
    })
    this.saleForm = this.fb.group({
      id: [this.cantidadVentas + 1],
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

  verificarCantidad() {
    const cant = this.cantInput.nativeElement.value;
    const esPesable = this.productForm.get('pesable')?.value;

    if (esPesable && cant.length === 4) {
      this.productForm.patchValue({ cant: parseFloat(cant) });
      this.addProductToSale(); // Agrega automáticamente si es pesable y largo === 4
    } else if (!esPesable) {
      // Solo escucha input manual del usuario, no patchValue
      const inputListener = () => { };

      this.cantInput.nativeElement.addEventListener('input', inputListener);

      // Aquí esperamos 500ms sin escribir
      setTimeout(() => {
        const cantidad = parseInt(this.cantInput.nativeElement.value, 10);
        if (!isNaN(cantidad) && cantidad > 0) {
          this.productForm.patchValue({ cant: cantidad });
          setTimeout(() => {
            this.addProductToSale(); // Agrega automáticamente si es no pesable y largo > 0
            this.cantInput.nativeElement.removeEventListener('input', inputListener); // Limpia el listener
            this.codeInput.nativeElement.focus(); // Regresa el foco al input de código
          }, 500)
        }
      }, 500);
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
    this.productForm.reset({
      code: '',
      product: '',
      price: null,
      cant: null,
      pesable: false
    });

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

  eliminarProducto(index: number) {
    const productsArray = this.saleForm.get('products') as FormArray;
    if (index >= 0 && index < productsArray.length) {
      productsArray.removeAt(index);
      this.updateTotal(); // Actualiza el total después de eliminar
    }
  }

  editarProducto(index: number) {
    console.log('Editar producto: ', this.saleForm.get('products')?.value[index]);
    this.editProductForm.patchValue(this.saleForm.get('products')?.value[index]);
  }

  guardarCambios() {
    const index = this.saleForm.get('products')?.value.findIndex((p: any) => p.code === this.editProductForm.get('code')?.value);
    if( index !== -1) {
      const productsArray = this.saleForm.get('products') as FormArray;
      productsArray.at(index).patchValue(this.editProductForm.value);
      this.updateTotal(); // Actualiza el total después de editar
      this.editProductForm.reset();
    }
  }

}
