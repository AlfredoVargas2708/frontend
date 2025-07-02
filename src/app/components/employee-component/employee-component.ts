import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class EmployeeComponent implements AfterViewInit, OnInit {

  productForm!: FormGroup;
  saleForm!: FormGroup;
  editProductForm!: FormGroup;

  products: any[] = []; // Aquí puedes almacenar los productos si es necesario

  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cantInput') cantInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private salesService: SalesService,
    private cdf: ChangeDetectorRef) 
    {
    this.productForm = this.fb.group({
      id: [null],
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
  }

  ngOnInit() {
    this.salesService.getCantidadVentas().subscribe({
      next: (cantidad) => {
        this.saleForm = this.fb.group({
          id: [cantidad + 1],
          date: [new Date()],
          total: [0],
        });
        this.cdf.markForCheck(); // Asegura que la vista se actualice
      },
      error: (err) => {
        console.error('Error al obtener cantidad de ventas', err);
      }
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.codeInput.nativeElement.focus(), 100);
  }

  getProduct(event: any) {
    const code = event.target.value;
    this.productService.getProduct(code).subscribe({
      next: (data) => {
        this.productForm.patchValue({
          id: data.product_id,
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

  getIdVenta(): Number {
    let id: Number = 0;
    this.salesService.getCantidadVentas().subscribe({
      next: (cantidad) => {
        id = cantidad + 1;
      },
      error: (err) => {
        console.error('Error fetching sales count:', err);
      }
    })
    return id;
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

    // Verifica si el producto ya existe en la venta
    const existingProducts = this.products.find(p => p.code === product.code);

    if (existingProducts) {
      // Si el producto ya existe, actualiza la cantidad
      const index = this.products.findIndex(p => p.code === product.code);
      this.products[index].cant += product.cant;
    } else {
      // Si no existe, lo agrega al array de productos
      this.products.push(product);
    }

    // Reinicia el productForm después de agregarlo
    this.productForm.reset({
      id: null,
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
    let total = 0;

    this.products.forEach(product => {
      total += product.price * product.cant;
    });

    this.saleForm.patchValue({ total: total });
  }

  eliminarProducto(index: number) {
    if (index >= 0 && index < this.products.length) {
      this.products.splice(index, 1);
      this.updateTotal(); // Actualiza el total después de eliminar
    }
  }

  editarProducto(index: number) {
    console.log('Editar producto: ', this.products[index]);
    this.editProductForm.patchValue(this.products[index]);
  }

  guardarCambios() {
    const index = this.products.findIndex((p: any) => p.code === this.editProductForm.get('code')?.value);
    if (index !== -1) {
      this.products[index] = this.editProductForm.value;
      this.updateTotal(); // Actualiza el total después de editar
      this.editProductForm.reset();
    }
  }

  crearVenta() {
    if (this.saleForm.invalid || this.products.length === 0) {
      console.error('Formulario inválido o sin productos');
      return;
    }

    this.salesService.getCantidadVentas().subscribe({
      next: (cantidad) => {
        const saleData = {
          ...this.saleForm.value,
          id: cantidad + 1,
        };

        this.salesService.createSale(saleData, this.products).subscribe({
          next: () => {
            this.saleForm.reset({
              id: cantidad + 2, // para la siguiente venta
              date: new Date(),
              total: 0,
            });
            this.products = []; // Limpia la lista de productos
            this.cdf.markForCheck(); // Asegura que la vista se actualice
          },
          error: (error) => {
            console.error('Error al crear la venta:', error);
          }
        });
      },
      error: (err) => {
        console.error('Error obteniendo cantidad de ventas:', err);
      }
    });
  }
}
