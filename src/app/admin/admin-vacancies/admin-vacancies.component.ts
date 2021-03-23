import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

// rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IVacancy } from 'src/app/shared/interfaces/vacancy.interface';
import { Vacancy } from 'src/app/shared/models/vacancy.model';
import { VacancyService } from 'src/app/shared/services/vacancy.service';

@Component({
  selector: 'app-admin-vacancies',
  templateUrl: './admin-vacancies.component.html',
  styleUrls: ['./admin-vacancies.component.scss']
})
export class AdminVacanciesComponent implements OnInit {

  displayedColumns: string[] = ['title', 'image', 'edit', 'delete'];

  vacancies: IVacancy[] = [];

  title: string;
  description: string;

  image: File;

  uploadPercentIcon: Observable<number>;
  pathToImage: string;

  updateVacancyID: string;
  updateStatus: boolean;

  constructor(
    private storage: AngularFireStorage,
    private vacancyService: VacancyService
  ) { }

  ngOnInit(): void {
    this.getVacancies();
  }

  resetForm(): void {
    this.title = null;
    this.description = null;

    this.pathToImage = null;
    this.uploadPercentIcon = null;
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

  addNewVacancy() {
    let newVacancy = new Vacancy(this.title, this.description, this.pathToImage);

    if (!this.updateStatus) {
      this.vacancyService.addFireCloudVacancy(newVacancy)
        .then(() => this.getVacancies())
        .catch(error => console.log(error));
    }
    else {
      this.vacancyService.updateFireCloudVacancy(this.updateVacancyID, newVacancy)
        .then(() => this.getVacancies())
        .catch(error => console.log(error));
    }

    this.resetForm();
  }

  uploadFile($event, folder: string): void {
    const file = $event.target.files[0];

    const filePath = `${folder}/${file.name}`;
    const ref = this.storage.ref(filePath);

    const task = ref.put(file);

    this.uploadPercentIcon = task.percentageChanges();

    task.then(image => {
      this.storage.ref(`${folder}/${image.metadata.name}`)
        .getDownloadURL()
        .subscribe(url => {
          this.pathToImage = url;
        });
    });
  }

  updateVacancy(vacancy: IVacancy): void {
    let { id, title, description, pathToImage } = vacancy;

    this.updateVacancyID = id;
    this.title = title;
    this.description = description;

    this.pathToImage = pathToImage;

    this.updateStatus = true;
  }

  deleteVacancy(id: string): void {
    this.vacancyService.deleteFireCloudVacancy(id)
      .then(() => {
        this.getVacancies();
      })
      .catch(error => console.log(error));
  }

}
