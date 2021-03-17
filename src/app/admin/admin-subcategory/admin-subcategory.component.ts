import { Component, OnInit } from '@angular/core';

import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';

import { map } from 'rxjs/operators';
import { Subcategory } from 'src/app/shared/models/subcategory.model';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-subcategory',
  templateUrl: './admin-subcategory.component.html',
  styleUrls: ['./admin-subcategory.component.scss']
})
export class AdminSubcategoryComponent implements OnInit {

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  displayedColumns: string[] = ['name', 'urlName', 'categoryID', 'update', 'delete'];

  categories: ICategory[] = [];
  subcategories: ISubcategory[] = [];

  name: string;
  urlName: string;
  categoryID: string;

  updatedElementID: string;
  updateStatus: boolean;

  categoryArray: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getSubcategories();
  }

  // checkTopping(): void {
  //   console.log(this.toppings.value);
  // }

  resetForm(): void {
    this.name = null;
    this.urlName = null;
    this.categoryID = null;
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
        this.categoryArray = data;
      });
  }

  getSubcategories(): void {
    this.subcategoryService.getFireCloudSubcategories()
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
        })
      )
      .subscribe(data => {
        this.subcategories = data;

        this.categoryArray.map(el => el.subcategories = []);

        data.map(item => {
          let categoryIndex = this.categories.findIndex(cat => cat.id == item.categoryID);

          if (categoryIndex != -1) {
            this.categoryArray[categoryIndex].subcategories.push(item);
          }
        });
      });
  }

  addNewSubcategory(): void {
    const newSubcategory = new Subcategory(this.categoryID, this.urlName, this.name);

    if (!this.updateStatus) {
      this.subcategoryService.addFireCloudSubcategory(newSubcategory)
        .then(() => {
          this.getSubcategories();
        })
        .catch(error => console.log(error));
    }
    else {
      this.subcategoryService.updateFireCloudSubcategory(this.updatedElementID, newSubcategory)
        .then(() => {
          this.getSubcategories();
          this.updateStatus = false;
        })
        .catch(error => console.log(error));
    }

    this.resetForm();
  }

  updateSubcategory(category: ICategory): void {
    let { id, name } = this.subcategories.filter(({ id }) => id == category.id)[0];

    this.name = name;
    this.categoryID = null;

    this.updatedElementID = id;
    this.updateStatus = true;
  }

  deleteSubcategory(id: string): void {
    this.subcategoryService.deleteFireCloudSubcategory(id)
      .then(() => this.getSubcategories())
      .catch(error => console.log(error));
  }

}
