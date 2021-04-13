import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBasket } from '../interfaces/basket.interface';
import { IProduct } from '../interfaces/product.interface';
import { Basket } from '../models/basket.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketProducts: IBasket[] = [];

  private basketSubject = new BehaviorSubject<IBasket[]>(null);

  private countSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);

  constructor() {
    if (localStorage.getItem('basket-products')) {
      this.basketProducts = JSON.parse(localStorage.getItem('basket-products'));

      this.recalculateGeneralProductsCount();
      this.recalculateGeneralProductsPrice();

      this.setNextStep();
    }
  }

  getBasketChanges(): Observable<IBasket[]> {
    return this.basketSubject.asObservable();
  }

  addProductToBasket(product: IProduct): void {
    let newProduct = new Basket(product);

    this.basketProducts.push(Object.assign({}, newProduct));

    this.recalculateGeneralProductsCount();
    this.recalculateGeneralProductsPrice();

    this.setNextStep();
  }

  getCurrentBasket() {
    return this.basketProducts;
  }

  setNextStep(): void {
    if (this.basketProducts.length > 0) {
      this.basketSubject.next(this.basketProducts);
    }
    else {
      this.basketSubject.next([]);
    }

    localStorage.setItem('basket-products', JSON.stringify(this.basketProducts));
  }

  checkProductAvailability(id: string): number {
    return this.basketProducts.findIndex(v => v.product.id == id);
  }

  changeTheCountOfProduct(id: string, operation: boolean): void {
    let productIndex = this.checkProductAvailability(id);

    if (operation) {
      this.basketProducts[productIndex].count++;
    }
    else {
      if (this.basketProducts[productIndex].count > 1) {
        this.basketProducts[productIndex].count--;
      }
    }

    this.recalculateGeneralProductsCount();
    this.recalculateGeneralProductsPrice();

    this.setNextStep();
  }

  getTheCountOfProduct(id: string): number {
    let productIndex = this.basketProducts.findIndex(v => v.product.id == id);

    return this.basketProducts[productIndex].count;
  }

  // Product Count Methods
  getGeneralProductsCountChanges(): Observable<number> {
    return this.countSubject.asObservable();
  }

  recalculateGeneralProductsCount(): void {
    this.countSubject.next(this.basketProducts.reduce((preVal, nextVal) => preVal + nextVal.count, 0));
  }

  // Total Price Methods
  getGenetalProductsPriceChanges(): Observable<number> {
    return this.totalPriceSubject.asObservable();
  }

  recalculateGeneralProductsPrice(): void {
    let totalPrice: number = 0;

    this.basketProducts.forEach(item => {
      totalPrice += parseInt(item.product.price) * item.count;
    });

    this.totalPriceSubject.next(totalPrice);
  }

  removeItemFromBasket(id: string): void {
    let productIndex = this.checkProductAvailability(id);

    this.basketProducts.splice(productIndex, 1);

    this.setNextStep();

    this.recalculateGeneralProductsCount();
    this.recalculateGeneralProductsPrice();
  }

  // Total price of single product
  totalPriceOfSingleProduct(id: string): number {
    let productIndex = this.checkProductAvailability(id);

    return this.basketProducts[productIndex].count * parseInt(this.basketProducts[productIndex].product.price);
  }

  clearBasket(): void {
    this.basketProducts = [];

    this.recalculateGeneralProductsCount();
    this.recalculateGeneralProductsPrice();

    this.setNextStep();
  }
}
