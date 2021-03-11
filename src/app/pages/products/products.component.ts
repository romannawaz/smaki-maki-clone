import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';
import { TypeService } from 'src/app/shared/services/type.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  currentProductPage: string;

  currentCategory: ICategory;
  currentSubcategory: ISubcategory;

  currentSubcategoryURL: string;

  subcategories: ISubcategory[] = [];
  types: IType[] = [];

  currentFilter: string;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private typeService: TypeService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.currentProductPage = this.activatedRoute.snapshot.paramMap.get('category');

          if (activatedRoute.firstChild) {
            activatedRoute.firstChild.params
              .subscribe(url => {
                this.currentSubcategoryURL = url.subcategory;
              })
              .unsubscribe();
          }

          this.getCurrentCategory();
        }
      });
  }

  ngOnInit(): void { }

  getCurrentCategory(): void {
    // this.categoryService.getFireCloudCategories()
    //   .snapshotChanges()
    //   .pipe(
    //     map(changes => changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() })))
    //   )
    //   .subscribe(data => {
    //     this.currentCategory = data.filter(cat => cat.urlName == this.currentProductPage)[0];

    //     if (this.categoryID != this.currentCategory.id) {
    //       this.categoryID = this.currentCategory.id;

    //       this.getSubcategories();


    //     }
    //   });

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
        this.subcategories = data;

        this.getCurrentSubcategoryByUrlName();
      });
  }

  // getSubcategories(): void {
  //   this.subcategoryService.getFireCloudSubcategories()
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => {
  //         return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
  //       })
  //     )
  //     .subscribe(data => {
  //       this.subcategories = data.filter(cat => cat.categoryID == this.categoryID);
  //       this.getTypes();

  //       if (this.subcategories.length > 1) {
  //         this.route.navigateByUrl(`/products/${this.currentProductPage}/${this.subcategories[0].urlName}`);
  //       }
  //     });
  // }

  getCurrentSubcategoryByUrlName(): void {
    this.subcategoryService.getFireCloudSubcategoryByUrlName(this.currentSubcategoryURL)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(subcat => ({ id: subcat.payload.doc.id, ...subcat.payload.doc.data() })))
      )
      .subscribe(data => {
        this.currentSubcategory = data[0];

        this.getTypes();
      });
  }

  getTypes(): void {
    // this.typeService.getFireCloudTypes()
    //   .snapshotChanges()
    //   .pipe(
    //     map(changes => {
    //       return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
    //     })
    //   )
    //   .subscribe(data => {
    //     this.types = data;
    //     // console.log(this.types);
    //   });

    this.typeService.getFireCloudTypesBySubcategoryID(this.currentSubcategory.id)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(type => ({ id: type.payload.doc.id, ...type.payload.doc.data() })))
      )
      .subscribe(data => {
        this.types = data;
        console.log(data);
      });
  }
}
