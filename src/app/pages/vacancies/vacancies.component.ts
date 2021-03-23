import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { IVacancy } from 'src/app/shared/interfaces/vacancy.interface';
import { VacancyService } from 'src/app/shared/services/vacancy.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  p: number = 1;
  collection = [
    {
      title: "Сушист1",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
    {
      title: "Сушист2",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
    {
      title: "Сушист3",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
    {
      title: "Сушист4",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
    {
      title: "Сушист5",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
    {
      title: "Сушист6",
      description: "Що будете робити? - Готувати смачні роли та суші. Багато ролів та суші! Опануєте всі різновиди технологічних процесів у приготуванні страв японської кухні. З часом пізнаєте всі тонкощі східної кухні :)"
    },
  ]

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
