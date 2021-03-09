import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.checkAdminLogin()) {
      return true;
    }
    else {
      this.router.navigateByUrl('/admin-login');
    }
  }

  checkAdminLogin(): boolean {
    if (localStorage.getItem('admin')) {
      const admin = JSON.parse(localStorage.getItem('admin'));

      if (admin && admin.role == 'ADMIN') {
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
