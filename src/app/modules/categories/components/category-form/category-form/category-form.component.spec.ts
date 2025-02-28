import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from './../../../../../services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { of, throwError } from 'rxjs';
import { CategoryEvent } from 'src/app/models/categories/CategoryEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoriesServiceMock: jasmine.SpyObj<CategoriesService>;
  let messageServiceMock: jasmine.SpyObj<MessageService>;
  let dialogRefMock: jasmine.SpyObj<DynamicDialogRef>;
  let dialogConfigMock: DynamicDialogConfig;

  beforeEach(() => {
    categoriesServiceMock = jasmine.createSpyObj('CategoriesService', ['createNewCategory', 'edityCategoryName']);
    messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);
    dialogRefMock = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    dialogConfigMock = { data: { event: { action: CategoryEvent.ADD_CATEGORY_ACTION } } } as DynamicDialogConfig;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CategoryFormComponent],
      providers: [
        FormBuilder,
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct category action', () => {
    expect(component.categoryAction).toEqual(dialogConfigMock.data);
  });

  it('should call createNewCategory and show success message when adding a category', () => {
    component.categoryForm.setValue({ name: 'New Category' });
    categoriesServiceMock.createNewCategory.and.returnValue(of([] as GetCategoriesResponse[]));
    component.handleSubmitCategoryAction();

    expect(categoriesServiceMock.createNewCategory).toHaveBeenCalledWith({ name: 'New Category' });
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria criada com sucesso.',
      life: 3000,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call createNewCategory and show error message when adding a category fails', () => {
    component.categoryForm.setValue({ name: 'New Category' });
    categoriesServiceMock.createNewCategory.and.returnValue(throwError(() => new Error('Error')));
    component.handleSubmitCategoryAction();

    expect(categoriesServiceMock.createNewCategory).toHaveBeenCalledWith({ name: 'New Category' });
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao criar categorias.',
      life: 3000,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call edityCategoryName and show success message when editing a category', () => {
    component.categoryAction = { event: { action: CategoryEvent.EDIT_CATEGORY_ACTION, id: '1', categoryName: 'Old Category' } };
    component.categoryForm.setValue({ name: 'Edited Category' });
    categoriesServiceMock.edityCategoryName.and.returnValue(of(void 0));
    component.handleSubmitCategoryAction();

    expect(categoriesServiceMock.edityCategoryName).toHaveBeenCalledWith({
      name: 'Edited Category',
      category_id: '1',
    });
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria editada com sucesso.',
      life: 3000,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call edityCategoryName and show error message when editing a category fails', () => {
    component.categoryAction = { event: { action: CategoryEvent.EDIT_CATEGORY_ACTION, id: '1', categoryName: 'Old Category' } };
    component.categoryForm.setValue({ name: 'Edited Category' });
    categoriesServiceMock.edityCategoryName.and.returnValue(throwError(() => new Error('Error')));
    component.handleSubmitCategoryAction();

    expect(categoriesServiceMock.edityCategoryName).toHaveBeenCalledWith({
      name: 'Edited Category',
      category_id: '1',
    });
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao editar categoria.',
      life: 3000,
    });
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should reset the form when setCategoryName is called', () => {
    component.setCategoryName('Test Category');
    expect(component.categoryForm.value).toEqual({ name: 'Test Category' });
  });
});
