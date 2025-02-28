import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductFormComponent } from './product-form.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { of, throwError } from 'rxjs';
import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { DropdownModule } from 'primeng/dropdown';
import { ProductsService } from 'src/app/services/products/products.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productsServiceMock: jasmine.SpyObj<ProductsService>;
  let categoriesServiceMock: jasmine.SpyObj<CategoriesService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let routerMock: jasmine.SpyObj<Router>;
  let productsDataTransferServiceMock: jasmine.SpyObj<ProductsDataTransferService>;
  let dialogRefMock: jasmine.SpyObj<DynamicDialogRef>;
  let dialogConfigMock: DynamicDialogConfig;

  beforeEach(async () => {
    productsServiceMock = jasmine.createSpyObj('ProductsService', [
      'createProduct',
      'editProduct',
      'saleProduct',
      'getAllProducts',
    ]);
    productsServiceMock.createProduct.and.returnValue(
      of({
        id: '1',
        name: 'Product Name',
        price: '100',
        description: 'Product Description',
        amount: 10,
        category_id: '1',
      })
    );

    categoriesServiceMock = jasmine.createSpyObj('CategoriesService', [
      'getAllCategories',
    ]);
    categoriesServiceMock.getAllCategories.and.returnValue(of([]));

    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    productsDataTransferServiceMock = jasmine.createSpyObj(
      'ProductsDataTransferService',
      ['setProductsDatas']
    );
    dialogRefMock = jasmine.createSpyObj('DynamicDialogRef', ['close']);

    dialogConfigMock = {
      data: {
        event: {
          action: ProductEvent.ADD_PRODUCT_EVENT,
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, DropdownModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ProductsDataTransferService,
          useValue: productsDataTransferServiceMock,
        },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: FormBuilder, useClass: FormBuilder },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const categoriesResponse: GetCategoriesResponse[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    categoriesServiceMock.getAllCategories.and.returnValue(
      of(categoriesResponse)
    );

    component.ngOnInit();

    expect(component.categoriesDatas).toEqual(categoriesResponse);
    expect(categoriesServiceMock.getAllCategories).toHaveBeenCalled();
  });

  it('should create a product when add product form is valid', () => {
    const formValue: any = {
      name: 'Product Name',
      price: '100',
      description: 'Product Description',
      category_id: '1',
      amount: 10,
    };

    component.addProductForm.setValue(formValue);

    const createProductRequest: CreateProductRequest = {
      name: formValue.name,
      price: formValue.price,
      description: formValue.description,
      category_id: formValue.category_id,
      amount: formValue.amount,
    };

    const createProductResponse: CreateProductResponse = {
      id: '1',
      name: formValue.name,
      price: formValue.price,
      description: formValue.description,
      amount: formValue.amount,
      category_id: formValue.category_id,
    };

    productsServiceMock.createProduct.and.returnValue(
      of(createProductResponse)
    );

    component.handleSubmitAddProduct();

    expect(productsServiceMock.createProduct).toHaveBeenCalledWith(
      createProductRequest
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto criado com sucesso.',
      life: 2500,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should edit a product when edit product form is valid', () => {
    const formValue: any = {
      name: 'Updated Product Name',
      price: '150',
      description: 'Updated Product Description',
      amount: 20,
      category_id: '2',
    };

    component.productAction = {
      event: { action: ProductEvent.EDIT_PRODUCT_EVENT, id: '1' },
      productsDatas: [
        {
          id: '1',
          name: 'Product Name',
          amount: 10,
          description: 'Product Description',
          price: '100',
          category: { id: '1', name: 'Category 1' },
        },
      ],
    };

    component.editProductForm.setValue(formValue);

    const editProductRequest: EditProductRequest = {
      name: formValue.name,
      price: formValue.price,
      description: formValue.description,
      product_id: '1',
      amount: formValue.amount,
      category_id: formValue.category_id,
    };

    productsServiceMock.editProduct.and.returnValue(of(void 0));

    component.handleSubmitEditProduct();

    expect(productsServiceMock.editProduct).toHaveBeenCalledWith(
      editProductRequest
    );
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto editado com sucesso.',
      life: 2500,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should reset the addProductForm after submission', () => {
    const formValue = {
      name: 'Product Name',
      price: '100',
      description: 'Product Description',
      category_id: '1',
      amount: 10,
    };

    component.addProductForm.setValue(formValue);
    spyOn(component.addProductForm, 'reset');

    component.handleSubmitAddProduct();

    expect(component.addProductForm.reset).toHaveBeenCalled();
  });

  it('should load products data when getProductDatas is called', () => {
    const productsResponse: GetAllProductsResponse[] = [
      {
        id: '1',
        name: 'Product 1',
        price: '100',
        description: 'Desc 1',
        amount: 10,
        category: { id: '1', name: 'Category 1' },
      },
    ];

    productsServiceMock.getAllProducts.and.returnValue(of(productsResponse));

    component.getProductDatas();

    expect(component.productsDatas).toEqual(productsResponse);
    expect(
      productsDataTransferServiceMock.setProductsDatas
    ).toHaveBeenCalledWith(productsResponse);
  });

  it('should handle error correctly when add product fails', () => {
    const errorResponse = { message: 'Erro ao criar produto' };
    productsServiceMock.createProduct.and.returnValue(
      throwError(errorResponse)
    );

    const formValue = {
      name: 'Product Name',
      price: '100',
      description: 'Product Description',
      category_id: '1',
      amount: 10,
    };

    component.addProductForm.setValue(formValue);

    component.handleSubmitAddProduct();

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao criar produto.',
      life: 2500,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should handle error correctly when edit product fails', () => {
    const errorResponse = { message: 'Erro ao editar produto' };
    productsServiceMock.editProduct.and.returnValue(throwError(errorResponse));

    const formValue = {
      name: 'Updated Product Name',
      price: '150',
      description: 'Updated Product Description',
      amount: 20,
      category_id: '2',
    };

    component.productAction = {
      event: { action: ProductEvent.EDIT_PRODUCT_EVENT, id: '1' },
      productsDatas: [
        {
          id: '1',
          name: 'Product Name',
          amount: 10,
          description: 'Product Description',
          price: '100',
          category: { id: '1', name: 'Category 1' },
        },
      ],
    };

    component.editProductForm.setValue(formValue);

    component.handleSubmitEditProduct();

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao editar produto.',
      life: 2500,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should set productSelectedDatas and fill editProductForm when product is found', () => {
    const productId = '1';
    const allProducts = [
      {
        id: '1',
        name: 'Product 1',
        price: '100',
        amount: 10,
        description: 'Description 1',
        category: { id: '1', name: 'Category 1' },
      },
      {
        id: '2',
        name: 'Product 2',
        price: '150',
        amount: 20,
        description: 'Description 2',
        category: { id: '2', name: 'Category 2' },
      },
    ];

    component.productAction = {
      event: { action: ProductEvent.EDIT_PRODUCT_EVENT, id: '1' },
      productsDatas: allProducts,
    };

    spyOn(component.editProductForm, 'setValue');

    component.getProductSelectedDatas(productId);

    expect(component.productSelectedDatas).toEqual(allProducts[0]);
    expect(component.editProductForm.setValue).toHaveBeenCalledWith({
      name: 'Product 1',
      price: '100',
      amount: 10,
      description: 'Description 1',
      category_id: '1',
    });
  });

  it('should not set productSelectedDatas and keep form empty when no products are available', () => {
    const productId = '1';

    component.productAction = {
      event: { action: ProductEvent.ADD_PRODUCT_EVENT },
      productsDatas: [],
    };

    spyOn(component.editProductForm, 'setValue');

    component.getProductSelectedDatas(productId);

    expect(component.productSelectedDatas).toBeUndefined();
    expect(component.editProductForm.setValue).not.toHaveBeenCalled();
  });
});
