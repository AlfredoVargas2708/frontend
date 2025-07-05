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
  plotOptions?: ApexPlotOptions;
  markers?: ApexMarkers;
  legend?: {
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

  salesChartOptions!: ChartOptions;
  cantSalesChartOptions!: ChartOptions;
  productsChartOptions!: ChartOptions;
  productsOrdersChartOptions!: ChartOptions;

  salesData: any;
  actualDate: Date = new Date();

  constructor(
    private salesService: SalesService,
  ) { }

  ngOnInit() {
    this.loadChartData();
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
          colors: ["#FF1654"],
          yaxis: {
            title: {
              text: "Ventas (en CLP)"
            }
          }
        };
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
            text: "Cantidad de ventas por día durante el mes",
            align: "center"
          },
          colors: ["#00E396"],
          yaxis: {
            title: {
              text: "Cantidad de ventas"
            }
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
            text: "Cantidad de productos vendidos por día durante el mes",
            align: "center"
          },
          colors: ["#00E396"],
          yaxis: {
            title: {
              text: "Cantidad de productos"
            }
          }
        };
      },
      error: (error) => {
        console.error('Error fetching sales data:', error);
      },
    })
    this.salesService.getProductsSalesInTheMonth(this.actualDate).subscribe({
      next: (data) => {
        console.log('Product sales data:', data);
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
          colors: ["#008FFB"],
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
  }
}