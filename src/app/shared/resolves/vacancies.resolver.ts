import { Injectable } from '@angular/core';

import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { VacancyService } from '../services/vacancy.service';

import { IVacancy } from '../interfaces/vacancy.interface';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VacanciesResolver implements Resolve<Observable<IVacancy[]>> {
  constructor(
    private vacancyService: VacancyService
  ) { }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<IVacancy[]>> {
    await this.vacancyService.data$.pipe(take(1)).toPromise();

    return this.vacancyService.data$;
  }
}
