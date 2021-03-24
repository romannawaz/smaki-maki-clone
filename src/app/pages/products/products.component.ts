import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Interfaces
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';

// Services
import { CategoryService } from 'src/app/shared/services/category.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

// rxjs operators
import { map } from 'rxjs/operators';

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

  isCategoryChanged: boolean;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.subcategories = null;
          this.isCategoryChanged = true;
          // console.log(this.activatedRoute?.snapshot?.children[0]?.params?.subcategory);

          if (this.activatedRoute?.snapshot?.children[0]?.params?.subcategory) {
            this.isCategoryChanged = false;
          }

          // if (this.currentProductPage != this.activatedRoute.snapshot.paramMap.get('category')) {
          this.currentProductPage = this.activatedRoute.snapshot.paramMap.get('category');
          // }
          // else {
          //   this.isCategoryChanged = false;
          // }

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
        if (data && data.length > 0) {
          this.subcategories = data;

          if (this.isCategoryChanged) {
            this.route.navigateByUrl(`/products/${this.currentProductPage}/${this.subcategories[0].urlName}`);
          }
        }
      });
  }
}
