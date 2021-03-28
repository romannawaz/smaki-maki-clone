import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ModalSignInComponent } from 'src/app/pages/modal-sign-in/modal-sign-in.component';

import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

import { UserAuthService } from 'src/app/shared/services/auth/user-auth.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderTopComponent implements OnInit {

  @Output() headerStatus = new EventEmitter<boolean>();

  userLoggedState: boolean;

  constructor(
    private dialog: MatDialog,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.userAuthService.getStateChanges()
      .subscribe(state => {
        this.userLoggedState = state;
      });
  }

  closeFullSizeHeader(): void {
    this.headerStatus.emit(false);
  }

  openSignInModal() {
    this.dialog.open(ModalSignInComponent);
  }

}
