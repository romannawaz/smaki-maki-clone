import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
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

  subcategories: ISubcategory[] = [];
  types: IType[] = [];

  subcategoryFormGroup: FormGroup;
  filter: FormGroup;

  products: IProduct[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private typeService: TypeService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.subcategories = null;
          this.types = null;
          this.products = null;

          this.subcategoryFormGroup.value.subcategory = null;

          this.currentProductPage = this.activatedRoute.snapshot.paramMap.get('category');

          this.getCurrentCategory();

          this.filter = this.fb.group({
            productFilter: ['all', Validators.required]
          });
        }
      });

    this.subcategoryFormGroup = this.fb.group({
      subcategory: ['', Validators.required]
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

            this.subcategoryFormGroup = this.fb.group({
              subcategory: [this.subcategories[0].id, Validators.required]
            });

            this.getCurrentSubcategory();
          }
          else {
            this.getProductsByCategoryID();
          }
        }
      });
  }

  getCurrentSubcategory(): void {
    this.products = null;
    this.types = null;

    this.subcategoryService.getFireCloudSubcategoryByID(this.subcategoryFormGroup.value.subcategory)
      .get()
      .pipe(
        map(changes => ({ id: changes.id, ...changes.data() }))
      )
      .subscribe(data => {
        this.currentSubcategory = data;

        this.getTypes();
      });

  }

  getTypes(): void {
    this.typeService.getFireCloudTypesBySubcategoryID(this.currentSubcategory.id)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(type => ({ id: type.payload.doc.id, ...type.payload.doc.data() })))
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.types = data;

          this.getProductsByType();
        }
        else {
          this.getProductBySubcategoryID();
        }
      });
  }

  // -----------

  getProductsByCategoryID(): void {
    this.productService.getFireCloudProductsByCategoryID(this.currentCategory.id)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
      )
      .subscribe(data => {
        this.products = data;
      });
  }

  getProductBySubcategoryID(): void {
    this.productService.getFireCloudProductsBySubcategoryID(this.subcategoryFormGroup.value.subcategory)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
      )
      .subscribe(data => {
        this.products = data;
      });
  }

  getProductsByType(): void {
    this.products = null;

    if (this.filter.value.productFilter === 'all') {
      this.getProductBySubcategoryID();
    }
    else {
      this.productService.getFireCloudProductsByTypeID(this.filter.value.productFilter)
        .snapshotChanges()
        .pipe(
          map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
        )
        .subscribe(data => {
          this.products = data;
        });
    }
  }
}
