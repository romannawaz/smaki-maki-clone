import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {

  userID: string;

  orders: IOrder[] = [];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.userID = JSON.parse(localStorage.getItem('user'));

    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getFireCloudOrdersByUserID(this.userID)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(order => ({ id: order.payload.doc.id, ...order.payload.doc.data() })))
      )
      .subscribe(orders => {
        this.orders = orders;

        console.log(this.orders);
      });
  }

}
