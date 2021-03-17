import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  currentProductPage: string;

  currentCategory: ICategory;
  currentSubcategory: ISubcategory;

  subcategories: ISubcategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {

          this.currentProductPage = this.activatedRoute.snapshot.paramMap.get('category');

          this.getCurrentCategory();
        }
      });
  }

  ngOnInit(): void {
    this.getCurrentCategory();
  }

  getCurrentCategory(): void {
    this.categoryService.getFireCloudCategoryByUrlName(this.currentProductPage)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(cat => ({ id: cat.payload.doc.id, ...cat.payload.doc.data() })))
      )
      .subscribe(data => {
        if (this.currentCategory != data[0]) {
          this.currentCategory = data[0];

          this.getSubcategoriesByCategoryID();
        }
      });
  }

  getSubcategoriesByCategoryID() {
    this.subcategoryService.getFireCloudSubcategoriesByCategoryID(this.currentCategory.id)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
      )
      .subscribe(data => {
        if (data) {
          if (data.length > 0) {
            this.subcategories = data;
          }
        }
      });
  }
}
