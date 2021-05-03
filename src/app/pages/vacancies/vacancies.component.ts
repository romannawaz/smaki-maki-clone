import { Component, OnInit } from '@angular/core';

// Interfaces
import { IVacancy } from 'src/app/shared/interfaces/vacancy.interface';

// rxjs operators
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  p: number = 1;

  vacancies: IVacancy[] = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.getVacancies();

    this.route.data.subscribe(data => {
      data['vacancies'].subscribe((data: IVacancy[]) => {
        this.vacancies = data;
      });
    });
  }

  // getVacancies(): void {
  //   this.vacancyService.getFireCloudVacancies()
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => changes.map(vac => ({ id: vac.payload.doc.id, ...vac.payload.doc.data() })))
  //     )
  //     .subscribe(data => {
  //       this.vacancies = data;
  //     })
  // }
}
