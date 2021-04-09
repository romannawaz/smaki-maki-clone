import { Component, OnInit } from '@angular/core';

import { BasketService } from 'src/app/shared/services/basket.service';

import { IBasket } from 'src/app/shared/interfaces/basket.interface';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  userName: string;
  userPhone: string;
  userEmail: string;

  street: string;
  house: string;
  apartment: string;
  entrance: string;
  floor: string;

  comment: string;

  basket: IBasket[] = [];

  constructor(
    private basketService: BasketService,
    private orderService: OrderService
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

  checkout(): void {
    let userID = JSON.parse(localStorage.getItem('user'));

    let newOrder = new Order(
      userID,
      this.userName,
      this.userPhone,
      this.userEmail,

      this.street,
      this.house,
      this.apartment,
      this.entrance,
      this.floor,

      this.basket,

      this.comment
    );

    let productsNames = this.basket.map(
      product => {
        return `-${product.product.name}: ${product.count} шт.`;
      }
    );

    let string =
      `
*You have a new order!*

*Products:*
${productsNames.join('\n')}

*Contacts:*
_Name_: ${this.userName}
_Email_: ${this.userEmail}

*Adress:*
_Street_: ${this.street}
_House_: ${this.house}
_Apartment_: ${this.apartment}
_Entrance_: ${this.entrance}
_Floor_: ${this.floor}

*Comment:*
${this.comment}
  `;

    let urlString = encodeURIComponent(string);

    fetch(`https://api.telegram.org/bot1678260692:AAGF-vwtzelA3NkudfHtt2H_4HYRLmVBxvI/sendMessage?chat_id=-1001207488424&text=${urlString}&parse_mode=markdown`, {
      method: 'POST'
    });


    this.orderService.addFireCloudOrder(newOrder)
      .then(() => 'order added successful');

    this.basketService.clearBasket();
  }

}
