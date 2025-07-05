import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexMarkers,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
  ApexYAxis
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
  colors: String[];
  plotOptions: ApexPlotOptions;
  markers?: ApexMarkers;
  legend: {
    show: boolean;
  },
  yaxis: ApexYAxis;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  isLoading: boolean = true;

  salesChartOptions!: ChartOptions;
  cantSalesChartOptions!: ChartOptions;
  productsChartOptions!: ChartOptions;
  productsOrdersChartOptions!: ChartOptions;

  salesData: any;
  actualDate: Date = new Date();

  constructor(
    private salesService: SalesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadChartData();
  }

  getRandomColors(length: number): string[] {
    const colors = [];
    for (let i = 0; i < length; i++) {
      // Genera tonos de verde variando el canal HSL
      const hue = 120; // 120 es verde en HSL
      const saturation = 60 + Math.floor((i / length) * 30); // 60% a 90%
      const lightness = 40 + Math.floor((i / length) * 30); // 40% a 70%
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }

  loadChartData() {
    this.salesService.getSalesInTheMonth(this.actualDate).subscribe({
      next: (data) => {
        this.salesChartOptions = {
          series: [
            {
              name: "Ventas",
              data: data.map((sale: any) => sale.total_amount)
            }
          ],
          chart: {
            type: "line",
            height: 350,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
              distributed: true
            }
          },
          xaxis: {
            categories: data.map((sale: any) => new Date(sale.sale_day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })),
            title: {
              text: "Fecha de venta"
            }
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          stroke: {
            curve: "smooth"
          },
          title: {
            text: "Ganancias por día durante el mes",
            align: "center"
          },
          colors: ["#198754"],
          yaxis: {
            title: {
              text: "Ventas (en CLP)"
            }
          },
          legend: {
            show: false
          }
        };
        const salesColors = this.getRandomColors(data.length);
        const productsColors = this.getRandomColors(data.reduce((acc: number, sale: any) => acc + sale.products.length, 0));
        this.cantSalesChartOptions = {
          series: [
            {
              name: "Cantidad de ventas",
              data: data.map((sale: any) => sale.total_sales)
            }
          ],
          chart: {
            type: "bar",
            height: 350,
            toolbar: {
              show: false
            },
          },
          xaxis: {
            categories: data.map((sale: any) => new Date(sale.sale_day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })),
            title: {
              text: "Fecha de venta"
            }
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          stroke: {
            curve: "smooth"
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
              distributed: true
            }
          },
          title: {
            text: "Cantidad de ventas por día durante el mes",
            align: "center"
          },
          colors: salesColors,
          yaxis: {
            title: {
              text: "Cantidad de ventas"
            }
          },
          legend: {
            show: false
          }
        };
        this.productsChartOptions = {
          series: [
            {
              name: "Productos",
              data: data.map((sale: any) => sale.products.reduce((total: number, product: any) => total + product.quantity, 0))
            }
          ],
          chart: {
            type: "bar",
            height: 350,
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: data.map((sale: any) => new Date(sale.sale_day).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })),
            title: {
              text: "Fecha de venta"
            }
          },
          plotOptions: {
            bar: {
              columnWidth: '50%',
              distributed: true
            }
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          stroke: {
            curve: "smooth"
          },
          title: {
            text: "Cantidad total de productos vendidos por día durante el mes",
            align: "center"
          },
          colors: productsColors,
          yaxis: {
            title: {
              text: "Cantidad de productos"
            }
          },
          legend: {
            show: false
          }
        };
      },
      error: (error) => {
        console.error('Error fetching sales data:', error);
      },
    })
    this.salesService.getProductsSalesInTheMonth(this.actualDate).subscribe({
      next: (data) => {
        const productsColors = this.getRandomColors(data.length);
        this.productsOrdersChartOptions = {
          series: [
            {
              name: "Productos vendidos",
              data: data.map((product: any) => product.cant)
            }
          ],
          chart: {
            type: "bar",
            height: 350,
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: data.map((product: any) => product.product_name),
            title: {
              text: "Productos"
            },
            labels: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              distributed: true,
              columnWidth: '50%',
            }
          },
          legend: {
            show: false
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            borderColor: "#f1f1f1"
          },
          stroke: {
            curve: "smooth"
          },
          title: {
            text: "Cantidad de productos vendidos durante el mes",
            align: "center"
          },
          colors: productsColors,
          yaxis: {
            title: {
              text: "Cantidad de productos"
            }
          }
        }
      },
      error: (error) => {
        console.error('Error fetching product sales data:', error);
      }
    })
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 1000)
  }
}