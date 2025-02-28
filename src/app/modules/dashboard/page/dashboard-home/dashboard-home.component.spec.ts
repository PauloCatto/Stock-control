import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHomeComponent } from './dashboard-home.component';
import { ProductsService } from './../../../../services/products/products.service';
import { MessageService } from 'primeng/api';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { DashboardPdfService } from './dashboard-pdf.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let productsDtService: jasmine.SpyObj<ProductsDataTransferService>;
  let dashboardPdfService: jasmine.SpyObj<DashboardPdfService>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getAllProducts',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const productsDtServiceSpy = jasmine.createSpyObj(
      'ProductsDataTransferService',
      ['setProductsDatas']
    );
    const dashboardPdfServiceSpy = jasmine.createSpyObj('DashboardPdfService', [
      'setChartElement',
    ]);

    const mockResponse: GetAllProductsResponse[] = [
      {
        id: '1',
        name: 'Product 1',
        amount: 10,
        description: 'Description 1',
        price: '100',
        category: { id: '1', name: 'Category 1' },
      },
      {
        id: '2',
        name: 'Product 2',
        amount: 20,
        description: 'Description 2',
        price: '200',
        category: { id: '2', name: 'Category 2' },
      },
    ];
    productsServiceSpy.getAllProducts.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      declarations: [DashboardHomeComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        {
          provide: ProductsDataTransferService,
          useValue: productsDtServiceSpy,
        },
        { provide: DashboardPdfService, useValue: dashboardPdfServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;

    productsService = TestBed.inject(
      ProductsService
    ) as jasmine.SpyObj<ProductsService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    productsDtService = TestBed.inject(
      ProductsDataTransferService
    ) as jasmine.SpyObj<ProductsDataTransferService>;
    dashboardPdfService = TestBed.inject(
      DashboardPdfService
    ) as jasmine.SpyObj<DashboardPdfService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProductsData and update productsList and chart data on success', () => {
    const mockResponse: GetAllProductsResponse[] = [
      {
        id: '1',
        name: 'Product 1',
        amount: 10,
        description: 'Description 1',
        price: '100',
        category: { id: '1', name: 'Category 1' },
      },
      {
        id: '2',
        name: 'Product 2',
        amount: 20,
        description: 'Description 2',
        price: '200',
        category: { id: '2', name: 'Category 2' },
      },
    ];

    productsService.getAllProducts.and.returnValue(of(mockResponse));

    spyOn(component, 'setProductsChartConfig');

    component.getProductsData();

    expect(productsService.getAllProducts).toHaveBeenCalled();
    expect(component.productsList).toEqual(mockResponse);
    expect(productsDtService.setProductsDatas).toHaveBeenCalledWith(
      mockResponse
    );
    expect(component.setProductsChartConfig).toHaveBeenCalled();
  });

  it('should show error message when getProductsData fails', () => {
    const errorResponse = new Error('Error fetching products');

    productsService.getAllProducts.and.returnValue(
      throwError(() => errorResponse)
    );

    component.getProductsData();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar pedidos',
      life: 2500,
    });
  });
});
