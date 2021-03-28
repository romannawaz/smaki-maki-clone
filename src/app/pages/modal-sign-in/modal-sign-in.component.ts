import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { UserAuthService } from 'src/app/shared/services/auth/user-auth.service';

import { ModalSignUpComponent } from '../modal-sign-up/modal-sign-up.component';

@Component({
  selector: 'app-modal-sign-in',
  templateUrl: './modal-sign-in.component.html',
  styleUrls: ['./modal-sign-in.component.scss']
})
export class ModalSignInComponent {

  signInEmail: string;
  signInPassword: string;

  constructor(
    private auth: UserAuthService,
    private dialog: MatDialog
  ) { }

  openSignUpModal() {
    this.dialog.closeAll();

    this.dialog.open(ModalSignUpComponent);
  }

  signInUser(): void {
    this.auth.signInUser(this.signInEmail, this.signInPassword);

    this.dialog.closeAll();
  }

}
