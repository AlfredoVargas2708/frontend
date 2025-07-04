import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApexChart, ApexDataLabels, ApexMarkers, ApexPlotOptions, ApexStroke, ApexXAxis, NgApexchartsModule } from 'ng-apexcharts';
import { ProductsService } from '../../../services/products.service';
import { SalesService } from '../../../services/sales.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors?: string[];
  markers?: ApexMarkers;
}


@Component({
  selector: 'app-sales',
  imports: [CommonModule, NgApexchartsModule, ReactiveFormsModule],
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

  dateChartOptions!: ChartOptions;
  dateSales: any[] = [];
  productChartOptions!: ChartOptions;

  expandedIndex: number | null = null;

  dateForm: FormGroup;

  constructor(
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    private salesService: SalesService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

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

  createDateChart() {
    const { startDate, endDate } = this.dateForm.value;
    if (!startDate || !endDate) {
      console.error('Start date and end date are required');
      return;
    }
    this.salesService.getSalesBetweenDates(startDate, endDate).subscribe({
      next: (data) => {
        this.dateSales = data;
        if (data.length === 0) {
          console.warn('No sales data found for the selected date range');
          this.dateChartOptions = {
            series: [],
            chart: { type: 'line', height: 400 },
            xaxis: { categories: [] },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2, colors: ['#34c38f'] }
          };
          this.cdr.markForCheck();
          return;
        }
        this.dateChartOptions = {
          series: [
            {
              name: 'Ventas',
              data: data.map(sale => sale.total_vendido_dia),
            }
          ],
          chart: {
            type: 'line',
            height: 400,
            toolbar: {
              show: false
            }
          },
          stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#34c38f'] // Green color for the line
          },
          xaxis: {
            categories: data.map(sale => new Date(sale.sale_day).toLocaleDateString()),
            labels: {
              rotate: -45,
              style: {
                fontSize: '12px',
                colors: '#333'
              }
            }
          },
          dataLabels: {
            enabled: false
          },
        }
        this.cdr.markForCheck(); // Ensure the view updates with the new chart data
      },
      error: (error) => {
        console.error('Error fetching sales data:', error);
      }
    })
  }

  toggleExpand(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
