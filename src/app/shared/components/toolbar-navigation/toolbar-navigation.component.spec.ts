import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarNavigationComponent } from './toolbar-navigation.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { DashboardPdfService } from 'src/app/modules/dashboard/page/dashboard-home/dashboard-pdf.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductFormComponent } from 'src/app/modules/products/components/products-table/product-form/product-form/product-form.component';
import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';

describe('ToolbarNavigationComponent', () => {
  let component: ToolbarNavigationComponent;
  let fixture: ComponentFixture<ToolbarNavigationComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;
  let dialogServiceMock: jasmine.SpyObj<DialogService>;
  let dashboardPdfServiceMock: jasmine.SpyObj<DashboardPdfService>;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    Object.defineProperty(routerMock, 'events', { get: () => of({}) });

    cookieServiceMock = jasmine.createSpyObj('CookieService', ['delete']);
    dialogServiceMock = jasmine.createSpyObj('DialogService', ['open']);
    dashboardPdfServiceMock = jasmine.createSpyObj('DashboardPdfService', [
      'generatePdf',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ToolbarNavigationComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: DashboardPdfService, useValue: dashboardPdfServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set showButton to true when router URL is /dashboard', () => {
    Object.defineProperty(routerMock, 'url', { get: () => '/dashboard' });

    component.ngOnInit();

    expect(component.showButton).toBeTrue();
  });

  it('should set showButton to false when router URL is not /dashboard', () => {
    Object.defineProperty(routerMock, 'url', { get: () => '/home' });

    component.ngOnInit();

    expect(component.showButton).toBeFalse();
  });

  it('should toggle dark mode', () => {
    const classListToggleSpy = spyOn(document.body.classList, 'toggle');

    component.toggle();

    expect(classListToggleSpy).toHaveBeenCalledWith('dark-mode');
  });

  it('should call dashboardPdfService.generatePdf when downloadPdf is called', () => {
    component.downloadPdf();

    expect(dashboardPdfServiceMock.generatePdf).toHaveBeenCalled();
  });

  it('should delete USER_INFO cookie and navigate to /home when handleLogout is called', () => {
    component.handleLogout();

    expect(cookieServiceMock.delete).toHaveBeenCalledWith('USER_INFO');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should open ProductFormComponent dialog when handleSaleProduct is called', () => {
    component.handleSaleProduct();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      ProductFormComponent,
      jasmine.objectContaining({
        header: ProductEvent.SALE_PRODUCT_EVENT,
        data: jasmine.objectContaining({
          event: jasmine.objectContaining({
            action: ProductEvent.SALE_PRODUCT_EVENT,
          }),
        }),
      })
    );
  });
});
