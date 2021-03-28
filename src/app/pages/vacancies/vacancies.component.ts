import { Component, OnInit } from '@angular/core';

// Interfaces
import { IVacancy } from 'src/app/shared/interfaces/vacancy.interface';

// Services
import { VacancyService } from 'src/app/shared/services/vacancy.service';

// rxjs operators
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  p: number = 1;

  vacancies: IVacancy[] = [];

  constructor(
    private vacancyService: VacancyService
  ) { }

  ngOnInit(): void {
    this.getVacancies();
  }

  getVacancies(): void {
    this.vacancyService.getFireCloudVacancies()
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(vac => ({ id: vac.payload.doc.id, ...vac.payload.doc.data() })))
      )
      .subscribe(data => {
        this.vacancies = data;
      })
  }
}
