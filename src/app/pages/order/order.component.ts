import { Component, OnInit } from '@angular/core';

import { BasketService } from 'src/app/shared/services/basket.service';

import { IBasket } from 'src/app/shared/interfaces/basket.interface';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  basket: IBasket[] = [];

  constructor(
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.basketService.getBasketChanges()
      .subscribe(basket => {
        this.basket = basket;
      });
  }

  getTheCountOfProduct(id: string): number {
    return this.basketService.getTheCountOfProduct(id);
  }

  totalPriceOfSingleProduct(id: string): number {
    return this.basketService.totalPriceOfSingleProduct(id);
  }

  changeTheCountOfProduct(id: string, operation: boolean): void {
    this.basketService.changeTheCountOfProduct(id, operation);
  }

  removeItemFromBasket(id: string): void {
    this.basketService.removeItemFromBasket(id);
  }


}
