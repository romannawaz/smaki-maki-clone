import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../services/auth/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  userAuthState: boolean;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.checkUserLogin()) {
      return true;
    }
    else {
      this.router.navigateByUrl('');
    }
  }

  checkUserLogin(): boolean {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));

      this.userAuthState = this.userAuthService.getCurrentState();

      if (user && this.userAuthState) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

}
