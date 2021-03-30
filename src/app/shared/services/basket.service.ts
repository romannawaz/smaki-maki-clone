import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBasket } from '../interfaces/basket.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketSubject = new BehaviorSubject<IBasket>(null);

  constructor() { }

  getBasketChanges(): Observable<IBasket> {
    return this.basketSubject.asObservable();
  }

  addProductToBasket(product: IProduct) {
    
  }
}
