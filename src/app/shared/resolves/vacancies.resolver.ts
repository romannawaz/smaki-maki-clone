import { Injectable } from '@angular/core';

import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VacancyService } from '../services/vacancy.service';

@Injectable({
  providedIn: 'root'
})
export class VacanciesResolver implements Resolve<boolean> {
  constructor(
    private vacancyService: VacancyService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.vacancyService.getFireCloudVacancies() ? true : false;
  }
}
