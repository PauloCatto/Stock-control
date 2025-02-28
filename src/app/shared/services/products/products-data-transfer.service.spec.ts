import { TestBed } from '@angular/core/testing';
import { ProductsDataTransferService } from './products-data-transfer.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

describe('ProductsDataTransferService', () => {
  let service: ProductsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set products data and update the productsDatas array', () => {
    const mockProducts: Array<GetAllProductsResponse> = [
      { id: '1', name: 'Product A', amount: 5, description: 'Desc A', price: '100.00', category: { id: 'cat1', name: 'Category 1' } },
      { id: '2', name: 'Product B', amount: 0, description: 'Desc B', price: '150.00', category: { id: 'cat2', name: 'Category 2' } },
      { id: '3', name: 'Product C', amount: 10, description: 'Desc C', price: '200.00', category: { id: 'cat3', name: 'Category 3' } },
    ];

    service.setProductsDatas(mockProducts);

    expect(service.productsDatas.length).toBe(2);
    expect(service.productsDatas[0].id).toBe('1');
    expect(service.productsDatas[1].id).toBe('3');
  });

  it('should not update productsDatas if null is passed', () => {
    service.setProductsDatas(null);

    expect(service.productsDatas.length).toBe(0);
  });

  it('should filter products with amount greater than 0', () => {
    const mockProducts: Array<GetAllProductsResponse> = [
      { id: '1', name: 'Product A', amount: 5, description: 'Desc A', price: '100.00', category: { id: 'cat1', name: 'Category 1' } },
      { id: '2', name: 'Product B', amount: 0, description: 'Desc B', price: '150.00', category: { id: 'cat2', name: 'Category 2' } },
      { id: '3', name: 'Product C', amount: 10, description: 'Desc C', price: '200.00', category: { id: 'cat3', name: 'Category 3' } },
    ];

    service.setProductsDatas(mockProducts);

    expect(service.productsDatas.length).toBe(2);
    expect(service.productsDatas[0].amount).toBeGreaterThan(0);
    expect(service.productsDatas[1].amount).toBeGreaterThan(0);
  });

  it('should only filter products when amount is greater than 0', () => {
    const mockProducts: Array<GetAllProductsResponse> = [
      { id: '1', name: 'Product A', amount: 5, description: 'Desc A', price: '100.00', category: { id: 'cat1', name: 'Category 1' } },
      { id: '2', name: 'Product B', amount: 0, description: 'Desc B', price: '150.00', category: { id: 'cat2', name: 'Category 2' } },
      { id: '3', name: 'Product C', amount: -1, description: 'Desc C', price: '200.00', category: { id: 'cat3', name: 'Category 3' } },
    ];

    service.setProductsDatas(mockProducts);

    expect(service.productsDatas.length).toBe(1);
    expect(service.productsDatas[0].id).toBe('1');
  });
});
