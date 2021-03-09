import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'urlName', 'icon', 'element', 'id'];

  categories: ICategory[];

  name: string;
  urlName: string;
  fileInput: File;
  pathToIcon: string;

  updatedElementID: string;
  updateStatus: boolean;

  uploadPercentIcon: Observable<number>;

  constructor(
    private storage: AngularFireStorage,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  resetForm(): void {
    this.name = '';
    this.urlName = '';
    this.pathToIcon = '';

    this.fileInput = null;
  }

  getCategories(): void {
    this.categoryService.getFireCloudCategories()
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
        })
      )
      .subscribe(data => {
        this.categories = data;
      });
  }

  addCategory(): void {
    const newCategory = new Category(this.name, this.urlName, this.pathToIcon);

    if (!this.updateStatus) {
      this.categoryService.addFireCloudCategory(newCategory)
        .then(() => {
          console.log('add category success');
          this.resetForm();
        })
        .catch(err => console.log(err));
    }
    else {
      this.saveChanges();
    }
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
          this.pathToIcon = url;
        });
    });
  }

  updateCategory(category: ICategory): void {
    let { id, name, urlName } = this.categories.filter(({ id }) => id == category.id)[0];

    this.name = name;
    this.urlName = urlName;

    this.updatedElementID = id;
    this.updateStatus = true;
  }

  saveChanges(): void {
    const updatedCategory = new Category(this.name, this.urlName, this.pathToIcon);

    this.categoryService.updateFireCloudCategory(this.updatedElementID, updatedCategory)
      .then(() => {
        this.getCategories();

        this.resetForm();

        this.updatedElementID = null;
        this.updateStatus = false;
      });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteFireCloudCategory(id)
      .then(() => this.getCategories());
  }

}
