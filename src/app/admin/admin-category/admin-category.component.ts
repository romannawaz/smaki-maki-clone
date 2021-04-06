import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';

import { map } from 'rxjs/operators';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'urlName', 'icon', 'edit', 'delete'];

  categories: ICategory[];

  iconName: string;
  pathToIcon: string;

  updatedElementID: string;
  updateStatus: boolean;

  uploadPercentIcon: Observable<number>;

  // FormControl
  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    urlName: new FormControl('', { validators: [Validators.required] }),
    image: new FormControl(null, { validators: [Validators.required] })
  });

  constructor(
    private storage: AngularFireStorage,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  resetForm(formDirective: FormGroupDirective): void {
    formDirective.resetForm();

    this.categoryForm.reset();

    this.iconName = '';
    this.pathToIcon = '';
    this.uploadPercentIcon = null;
  }

  getCategories(): void {
    this.categoryService.getFireCloudCategories()
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
      )
      .subscribe(data => {
        this.categories = data;
      });
  }

  addNewCategory(): void {
    if (this.categoryForm.valid) {
      let { name, urlName } = this.categoryForm.value;

      const newCategory = new Category(name, urlName, this.pathToIcon);

      if (!this.updateStatus) {
        this.categoryService.addFireCloudCategory(newCategory)
          .then(() => {
            console.log('add category success');
          })
          .catch(err => console.log(err));
      }
      else {
        this.saveChanges();
      }
    }
    else {
      console.log('form is not valid');
      return;
    }
  }

  updateCategory(categoryID: string): void {
    let { id, name, urlName, icon } = this.categories.filter(({ id }) => id == categoryID)[0];

    this.categoryForm.patchValue({ name, urlName });

    this.pathToIcon = icon;

    this.updatedElementID = id;
    this.updateStatus = true;
  }

  saveChanges(): void {
    let { name, urlName } = this.categoryForm.value;

    const updatedCategory = new Category(name, urlName, this.pathToIcon);

    this.categoryService.updateFireCloudCategory(this.updatedElementID, updatedCategory)
      .then(() => {
        this.getCategories();

        this.updatedElementID = null;
        this.updateStatus = false;
      });
  }

  deleteCategory(id: string): void {
    this.categoryService.deleteFireCloudCategory(id)
      .then(() => this.getCategories());
  }

  uploadFile($event, folder: string): void {
    if (this.pathToIcon) {
      this.storage.storage.refFromURL(this.pathToIcon).delete();
    }

    const file = ($event.target as HTMLInputElement).files[0];

    this.iconName = file.name;

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

}
