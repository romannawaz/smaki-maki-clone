import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/shared/services/auth/user-auth.service';

@Component({
  selector: 'app-user-cabinet',
  templateUrl: './user-cabinet.component.html',
  styleUrls: ['./user-cabinet.component.scss']
})
export class UserCabinetComponent implements OnInit {

  constructor(
    private userAuthService: UserAuthService
  ) { }

  ngOnInit(): void { }

  signOut(): void {
    this.userAuthService.signOutUser();
  }

}
