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
export class Dashboard implements AfterViewInit {
  salesChartOptions!: ChartOptions;
  productsChartOptions!: ChartOptions;
  cantProducts: number = 0;
  cantSales: number = 0;
  isLoading: boolean = true;

  currentYear = new Date().getFullYear();

  monthName = new Date().toLocaleString('es-CL', { month: 'long' });
  capitalizedMonth = this.monthName.charAt(0).toUpperCase() + this.monthName.slice(1);
  constructor(private salesService: SalesService, private productService: ProductsService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];

    this.salesService.getSalesByDateRange(startDate, endDate).subscribe({
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
    this.salesService.getProductsByDateRange(startDate, endDate).subscribe({
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

  generateColors(length: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      // Hue fijo en verde (120), variar saturación y/o luz
      const saturation = 60 + (i * 20) % 40; // 60% - 99%
      const lightness = 40 + (i * 10) % 30;  // 40% - 69%
      colors.push(`hsl(120, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }


  createSalesChart(data: any[]) {
    this.salesChartOptions = {
      series: [
        {
          name: "Ventas",
          type: 'line',
          data: data.map(sale => sale.sales_count)
        }
      ],
      chart: {
        height: 500,
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
        curve: "smooth" // Estilo de la línea
      },
      title: {
        text: `Ventas por día en el mes de ${this.capitalizedMonth} de ${new Date().getFullYear()}`,
        align: "center",
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Arial, sans-serif',
        },
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        title: {
          text: 'Días del Mes'  // Título del eje X
        },
        categories: data.map(sale => sale.sale_date)
      },
      yaxis: {
        title: {
          text: 'Total de Ventas'  // Título del eje Y
        }
      },
      colors: ['#5c9a45'], // Color de la línea
      markers: {
        size: 5,  // Tamaño de los marcadores en la línea
        colors: ['#8AE681'],  // Color de los marcadores
      }
    }
  }

  createProductsChart(data: any[]) {
    console.log('Products data:', data);
    const productNames = data.map(product => product.product_name);
    const quantities = data.map(product => product.total_quantity);
    const colors = this.generateColors(quantities.length);

    this.productsChartOptions = {
      series: [
        {
          name: "Cantidad Vendida",
          data: quantities,
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: { show: false },
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          horizontal: false, // Barra vertical
          columnWidth: '30%', // Ancho de las barras
          borderRadius: 5, // Bordes redondeados
          distributed: true, // Colores diferentes por barra
        }
      },
      colors: colors, // Se aplican por barra
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: productNames,
        title:{
          text: 'Productos'  // Título del eje X
        },
        labels: {
          show: false,
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Productos Vendidos'  // Título del eje Y
        }
      },
      title: {
        text: `Productos Vendidos en el mes de ${this.capitalizedMonth} de ${new Date().getFullYear()}`,
        align: "center",
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Arial, sans-serif',
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
    };
  }

}