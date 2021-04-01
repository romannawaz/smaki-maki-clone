import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ModalSignInComponent } from 'src/app/pages/modal-sign-in/modal-sign-in.component';
import { BasketComponent } from 'src/app/pages/basket/basket.component';

import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

import { UserAuthService } from 'src/app/shared/services/auth/user-auth.service';
import { BasketService } from 'src/app/shared/services/basket.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderTopComponent implements OnInit {

  @Output() headerStatus = new EventEmitter<boolean>();

  userLoggedState: boolean;

  generalCountOfProducts: number;
  totalPriceOfProducts: number;

  constructor(
    private dialog: MatDialog,
    private userAuthService: UserAuthService,
    private basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.userAuthService.getStateChanges()
      .subscribe(state => {
        this.userLoggedState = state;
      });

    this.basketService.getGeneralProductsCountChanges()
      .subscribe(count => {
        this.generalCountOfProducts = count;
      });

    this.basketService.getGenetalProductsPriceChanges()
      .subscribe(totalPrice => {
        this.totalPriceOfProducts = totalPrice;
      })
  }

  closeFullSizeHeader(): void {
    this.headerStatus.emit(false);
  }

  openSignInModal(): void {
    this.dialog.open(ModalSignInComponent);
  }

  openBasketModal(): void {
    this.dialog.open(BasketComponent);
  }

}
