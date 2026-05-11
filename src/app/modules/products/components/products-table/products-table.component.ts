import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductsEvent';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductActions';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
})
export class ProductsTableComponent implements OnInit, OnChanges {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  inStockCount = 0;
  zeroStockCount = 0;

  ngOnInit() { this.computeSummary(); }

  ngOnChanges() { this.computeSummary(); }

  computeSummary(): void {
    this.zeroStockCount = this.products.filter(p => !p.amount || p.amount === 0).length;
    this.inStockCount = this.products.length - this.zeroStockCount;
  }


  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(product_id: string, product_name: string): void {
    if (product_id !== '' && product_name !== '') {
      this.deleteProductEvent.emit({ product_id, product_name });
    }
  }
}
