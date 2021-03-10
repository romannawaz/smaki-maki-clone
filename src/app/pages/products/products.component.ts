import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  currentProductPage: string;

  categoryID: string;

  currentCategory: ICategory;
  currentSubcategoryURL: string;

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

          // if (activatedRoute.firstChild) {
          //   activatedRoute.firstChild.params
          //     .subscribe(url => {
          //       this.currentSubcategoryURL = url.subcategory;
          //       console.log(this.currentSubcategoryURL);
          //     })
          //     .unsubscribe();
          // }

          this.getCurrentCategory();
        }
      });
  }

  ngOnInit(): void { }

  getCurrentCategory(): void {
    this.categoryService.getFireCloudCategories()
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
      )
      .subscribe(data => {
        this.currentCategory = data.filter(cat => cat.urlName == this.currentProductPage)[0];

        if (this.categoryID != this.currentCategory.id) {
          this.categoryID = this.currentCategory.id;

          this.getSubcategories();
        }
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
        this.subcategories = data.filter(cat => cat.categoryID == this.categoryID);

        if (this.subcategories.length > 1) {
          this.route.navigateByUrl(`/products/${this.currentProductPage}/${this.subcategories[0].urlName}`);
        }
      });
  }
}
