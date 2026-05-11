import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from './../../../../services/products/products.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardPdfService } from './dashboard-pdf.service';
import { WebsocketService } from 'src/app/shared/services/websocket/websocket.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  productsList: Array<GetAllProductsResponse> = [];
  private destroy$ = new Subject<void>();

  totalStock = 0;
  totalValue = 0;
  zeroStockCount = 0;
  showButton = true;
  topProducts: Array<GetAllProductsResponse> = [];
  criticalProducts: Array<GetAllProductsResponse> = [];

  public productsChartDatas!: ChartData;
  public productsChartOptions!: ChartOptions;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService,
    private dashboardPdfService: DashboardPdfService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.getProductsData();

    this.websocketService.onProductUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getProductsData();
      });
  }

  getProductsData() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsList = response;
            this.productsDtService.setProductsDatas(this.productsList);
            this.computeKpis();
            this.setProductsChartConfig();
            this.dashboardPdfService.setChartElement(
              this.chartContainer.nativeElement
            );
          }
        },
        error: (err) => {
          console.log(err);
          if (err.status !== 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao buscar produtos',
              life: 2500,
            });
          }
        },
      });
  }

  computeKpis(): void {
    if (this.productsList.length > 0) {
      this.totalStock = this.productsList.reduce((sum, p) => sum + (p.amount || 0), 0);
      this.totalValue = this.productsList.reduce((sum, p) => sum + ((p.amount || 0) * (parseFloat(p.price) || 0)), 0);
      this.zeroStockCount = this.productsList.filter(p => !p.amount || p.amount === 0).length;

      
      this.topProducts = [...this.productsList]
        .sort((a, b) => (b.amount || 0) - (a.amount || 0))
        .slice(0, 5);

      
      this.criticalProducts = this.productsList
        .filter(p => (p.amount || 0) <= 5)
        .sort((a, b) => (a.amount || 0) - (b.amount || 0));
    }
  }

  exportPdf(): void {
    this.dashboardPdfService.generatePdf();
  }

  setProductsChartConfig(): void {
    if (this.productsList.length > 0) {
      this.productsChartDatas = {
        labels: this.productsList.map((p) => p?.name),
        datasets: [
          {
            label: 'Quantidade em estoque',
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(99, 102, 241, 0.95)',
            data: this.productsList.map((p) => p?.amount),
          },
        ],
      };

      this.productsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: { color: '#475569', font: { family: 'Inter', size: 13 } },
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            cornerRadius: 10,
            padding: 12,
          },
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { weight: 500 } },
            grid: { color: '#f1f5f9' },
          },
          y: {
            ticks: { color: '#64748b' },
            grid: { color: '#f1f5f9' },
            beginAtZero: true,
          },
        },
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
