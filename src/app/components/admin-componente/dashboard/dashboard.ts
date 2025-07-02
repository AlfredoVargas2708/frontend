import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";
import { SalesService } from '../../../services/sales.service';
import { ProductsService } from '../../../services/products.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers?: {
    size: number;
  }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements AfterViewInit {
  salesChartOptions!: ChartOptions;
  productsChartOptions!: ChartOptions;
  cantProducts: number = 0;
  cantSales: number = 0;
  isLoading: boolean = true;

  currentYear = new Date().getFullYear();

  firstDayOfYear = new Date(this.currentYear, 0, 1).toISOString().split('T')[0]; // "2024-01-01"
  lastDayOfYear = new Date(this.currentYear, 11, 31).toISOString().split('T')[0]; // "2024-12-31"

  constructor(private salesService: SalesService, private productService: ProductsService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.salesService.getSalesByDateRange(this.firstDayOfYear, this.lastDayOfYear).subscribe({
      next: (data) => {
        this.cantSales = data.length;  // Assuming 'data' is an array of sales
        this.createSalesChart(data);
      },
      error: (error) => {
        console.error('Error fetching sales data:', error);
      }
    })
    this.productService.getCantProducts().subscribe({
      next: (data) => {
        this.cantProducts = data.count;
      },
      error: (error) => {
        console.error('Error fetching product count:', error);
      }
    })
    this.salesService.getProductsByDateRange(this.firstDayOfYear, this.lastDayOfYear).subscribe({
      next: (data) => {
        this.createProductsChart(data);
      },
      error: (error) => {
        console.error('Error fetching products data:', error);
      }
    })
    setTimeout(() => {
      this.isLoading = false;  // End loading state
      this.cdr.markForCheck();  // Ensure the view is updated after data changes
    }, 1000)
  }

  createSalesChart(data: any[]) {
    this.salesChartOptions = {
      series: [
        {
          name: "Ventas",
          data: data.map(sale => sale.total)  // Assuming 'total' is the field for sales amount
        }
      ],
      chart: {
        height: 400,
        width: 600,
        type: "line",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"  // Changed to 'smooth' for a better line appearance
      },
      title: {
        text: `Ventas por Mes en el año ${new Date().getFullYear()}`,
        align: "center"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: data.map(sale => sale.mes)  // Assuming 'month' is the field for the month
      },
      markers: {
        size: 5  // Optional: Adjust the size of the markers on the line
      }
    }
  }

  createProductsChart(data: any[]) {
    this.productsChartOptions = {
      series: [
        {
          name: "Productos",
          data: data.map(product => product.total_vendido)  // Assuming 'total_vendido' is the field for product quantity
        }
      ],
      chart: {
        height: 300,
        width: 650,
        type: "bar",
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: `Cantidad de Productos Vendidos en el año ${new Date().getFullYear()}`,
        align: "center"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: data.map(product => product.product_name),  // Assuming 'product_name' is the field for the product name
        labels: {
          show: false
        }
      },
      markers: {
        size: 5
      }
    }
  }
}