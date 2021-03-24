import { Component } from '@angular/core';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { MatDialog } from '@angular/material/dialog';

import { ModalSignInComponent } from '../modal-sign-in/modal-sign-in.component';

@Component({
  selector: 'app-modal-sign-up',
  templateUrl: './modal-sign-up.component.html',
  styleUrls: ['./modal-sign-up.component.scss']
})
export class ModalSignUpComponent {

  signUpEmail: string;
  signUpPassword: string;

  constructor(
    private auth: AuthService,
    private dialog: MatDialog
  ) { }

  createNewUser(): void {
    this.auth.signUpUser(this.signUpEmail, this.signUpPassword);
  }

  openSignInModal() {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(ModalSignInComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
