import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IBasket } from 'src/app/shared/interfaces/basket.interface';
import { BasketService } from 'src/app/shared/services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket: IBasket[];

  generalPrice: number;
  bonuses: number | string;

  basketChangesSubscribe;
  generalPriceSubscribe;

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.basketChangesSubscribe = this.basketService.getBasketChanges()
      .subscribe(basket => {
        this.basket = basket;
      });

    this.generalPriceSubscribe = this.basketService.getGenetalProductsPriceChanges()
      .subscribe(price => {
        this.generalPrice = price;
        this.bonuses = (this.generalPrice * 0.05).toFixed(2);
      });
  }

  ngOnDestroy(): void {
    this.basketChangesSubscribe.unsubscribe();
    this.generalPriceSubscribe.unsubscribe();
  }

  getBasketProducts(): void { }

  getTheCountOfProduct(id: string): number {
    return this.basketService.getTheCountOfProduct(id);
  }

  changeTheCountOfProduct(id: string, operation: boolean): void {
    this.basketService.changeTheCountOfProduct(id, operation);
  }

  totalPriceOfSingleProduct(id: string): number {
    return this.basketService.totalPriceOfSingleProduct(id);
  }

  removeItemFromBasket(id: string): void {
    this.basketService.removeItemFromBasket(id);
  }

  toOrder(): void {
    this.dialog.closeAll();

    this.route.navigateByUrl('/order');
  }

}
