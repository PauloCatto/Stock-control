import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';
import { SaleProductResponse } from 'src/app/models/interfaces/products/response/SaleProductResponse';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieServiceMock = jasmine.createSpyObj('CookieService', ['get']);
    cookieServiceMock.get.and.returnValue('mockedJwtToken');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts', () => {
    it('should send a GET request to fetch all products', () => {
      const mockProducts: GetAllProductsResponse[] = [
        {
          id: '1',
          name: 'Product 1',
          amount: 10,
          description: 'Product 1 description',
          price: '10.00',
          category: { id: '1', name: 'Category 1' },
        },
        {
          id: '2',
          name: 'Product 2',
          amount: 0,
          description: 'Product 2 description',
          price: '20.00',
          category: { id: '2', name: 'Category 2' },
        },
      ];

      service.getAllProducts().subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products[0].name).toBe('Product 1');
      });

      const req = httpMock.expectOne(`${service['API_URL']}/products`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mockedJwtToken'
      );
      req.flush(mockProducts);
    });
  });

  describe('deleteProduct', () => {
    it('should send a DELETE request to delete a product', () => {
      const mockResponse: DeleteProductResponse = {
        id: '1',
        name: 'Product 1',
        price: '10.00',
        description: 'Product 1 description',
        amount: 10,
        category_id: '1',
      };
      const productId = '1';

      service.deleteProduct(productId).subscribe((response) => {
        expect(response.id).toBe('1');
        expect(response.name).toBe('Product 1');
      });

      const req = httpMock.expectOne(
        `${service['API_URL']}/product/delete?product_id=${productId}`
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mockedJwtToken'
      );
      req.flush(mockResponse);
    });
  });

  describe('createProduct', () => {
    it('should send a POST request to create a new product', () => {
      const createProductRequest: CreateProductRequest = {
        name: 'New Product',
        price: '15.00',
        description: 'New Product description',
        category_id: '1',
        amount: 20,
      };

      const mockCreateProductResponse: CreateProductResponse = {
        id: '1',
        name: 'New Product',
        price: '15.00',
        description: 'New Product description',
        amount: 20,
        category_id: '1',
      };

      service.createProduct(createProductRequest).subscribe((response) => {
        expect(response.name).toBe('New Product');
        expect(response.amount).toBe(20);
      });

      const req = httpMock.expectOne(`${service['API_URL']}/product`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mockedJwtToken'
      );
      req.flush(mockCreateProductResponse);
    });
  });

  describe('editProduct', () => {
    it('should send a PUT request to edit a product', () => {
      const editProductRequest: EditProductRequest = {
        product_id: '1',
        name: 'Edited Product',
        price: '25.00',
        description: 'Edited Product description',
        amount: 30,
        category_id: '1',
      };

      service.editProduct(editProductRequest).subscribe();

      const req = httpMock.expectOne(`${service['API_URL']}/product/edit`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mockedJwtToken'
      );
      req.flush(null);
    });
  });

  describe('saleProduct', () => {
    it('should send a PUT request to sell a product', () => {
      const saleProductRequest: SaleProductRequest = {
        product_id: '1',
        amount: 10,
      };

      const mockSaleProductResponse: SaleProductResponse = {
        id: '1',
        name: 'Product 1',
        amount: '10',
      };

      service.saleProduct(saleProductRequest).subscribe((response) => {
        expect(response.name).toBe('Product 1');
        expect(response.amount).toBe('10');
      });

      const req = httpMock.expectOne(
        `${service['API_URL']}/product/sale?product_id=1`
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.has('Authorization')).toBeTrue();
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer mockedJwtToken'
      );
      req.flush(mockSaleProductResponse);
    });
  });
});
