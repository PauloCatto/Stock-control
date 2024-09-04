import { CategoriesService } from './../../../../../services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoryEvent } from 'src/app/models/categories/CategoryEvent';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: [],
})
export class CategoryFormComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject();
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {}

  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const requetCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService
        .createNewCategory(requetCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria criada com sucesso.',
                life: 3000,
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar categorias.',
              life: 3000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
