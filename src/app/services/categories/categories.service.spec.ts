import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoriesService } from './categories.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/app/environments/environment';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;
  let cookieServiceMock: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieServiceMock = jasmine.createSpyObj('CookieService', ['get']);

    cookieServiceMock.get.and.returnValue('mockedJwtToken');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoriesService,
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    });

    service = TestBed.inject(CategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a GET request to fetch all categories', () => {
    const mockCategories: GetCategoriesResponse[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    service.getAllCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${environment.API_URL}/categories`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer mockedJwtToken'
    );
    req.flush(mockCategories);
  });

  it('should send a POST request to create a new category', () => {
    const requestData = { name: 'New Category' };
    const mockResponse: GetCategoriesResponse[] = [
      { id: '1', name: 'New Category' },
    ];

    service.createNewCategory(requestData).subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response[0].name).toBe('New Category');
    });

    const req = httpMock.expectOne(`${environment.API_URL}/category`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer mockedJwtToken'
    );
    expect(req.request.body).toEqual(requestData);
    req.flush(mockResponse);
  });

  it('should send a DELETE request to delete a category', () => {
    const categoryId = '1';

    service.deleteCategory({ category_id: categoryId }).subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/category/delete?category_id=${categoryId}`
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer mockedJwtToken'
    );
    req.flush({});
  });

  it('should send a PUT request to edit a category', () => {
    const requestData = { name: 'Updated Category', category_id: '1' };

    service.edityCategoryName(requestData).subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/category/edit?category_id=${requestData.category_id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer mockedJwtToken'
    );
    expect(req.request.body).toEqual({ name: requestData.name });
    req.flush({});
  });
});
