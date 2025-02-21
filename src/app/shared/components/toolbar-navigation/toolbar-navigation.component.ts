import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { ProductFormComponent } from 'src/app/modules/products/components/products-table/product-form/product-form/product-form.component';
import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';
import { DashboardPdfService } from 'src/app/modules/dashboard/page/dashboard-home/dashboard-pdf.service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: ['./toolbar-navigation.component.scss'],
})
export class ToolbarNavigationComponent {
  public showButton!: boolean;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private dialogService: DialogService,
    private dashboardPdfService: DashboardPdfService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.showButton = this.router.url === '/dashboard';
    });
  }

  toggle(): void {
    document.body.classList.toggle('dark-mode');
  }

  downloadPdf(): void {
    this.dashboardPdfService.generatePdf();
  }

  handleLogout(): void {
    this.cookieService.delete('USER_INFO');
    this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {
    const saleProductionAction = ProductEvent.SALE_PRODUCT_EVENT;

    this.dialogService.open(ProductFormComponent, {
      header: saleProductionAction,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: saleProductionAction },
      },
    });
  }
}
