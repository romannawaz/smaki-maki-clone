import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

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
    private auth: AuthService,
    private dialog: MatDialog
  ) { }

  openSignUpModal() {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(ModalSignUpComponent);
  }

  signInUser(): void {
    this.auth.signInUser(this.signInEmail, this.signInPassword);
  }

}
