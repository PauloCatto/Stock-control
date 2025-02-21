import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesTableComponent } from './categories-table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CategoriesTableComponent', () => {
  let component: CategoriesTableComponent;
  let fixture: ComponentFixture<CategoriesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    fixture = TestBed.createComponent(CategoriesTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteCategoryEvent when handleDeleteCategoryEvent is called with valid parameters', () => {
    spyOn(component.deleteCategoryEvent, 'emit');

    const category_id = '123';
    const categoryName = 'Sample Category';

    component.handleDeleteCategoryEvent(category_id, categoryName);

    expect(component.deleteCategoryEvent.emit).toHaveBeenCalledWith({ category_id, categoryName });
  });

  it('should not emit deleteCategoryEvent when handleDeleteCategoryEvent is called with invalid parameters', () => {
    spyOn(component.deleteCategoryEvent, 'emit');

    component.handleDeleteCategoryEvent('', '');

    expect(component.deleteCategoryEvent.emit).not.toHaveBeenCalled();
  });
});
