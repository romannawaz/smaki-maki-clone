import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';
import { TypeService } from 'src/app/shared/services/type.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  currentSubcategoryUrlName: string;

  currentSubcategory: ISubcategory;

  types: IType[] = [];
  filter: FormGroup;

  products: IProduct[] = [];

  constructor(
    private fb: FormBuilder,
    private subcategoryService: SubcategoryService,
    private typeService: TypeService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.types = null;
          this.products = null;

          this.currentSubcategoryUrlName = this.activatedRoute.snapshot.paramMap.get('subcategory');

          this.getCurrentSubcategory();

          this.filter = this.fb.group({
            productFilter: ['all', Validators.required]
          });
        }
      });
  }

  ngOnInit(): void { }

  getCurrentSubcategory(): void {
    this.subcategoryService.getFireCloudSubcategoryByUrlName(this.currentSubcategoryUrlName)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(subcategory => ({ id: subcategory.payload.doc.id, ...subcategory.payload.doc.data() })))
      )
      .subscribe(data => {
        this.currentSubcategory = data[0];

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

  // getProductsByCategoryID(): void {
  //   this.productService.getFireCloudProductsByCategoryID(this.currentCategory.id)
  //     .snapshotChanges()
  //     .pipe(
  //       map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
  //     )
  //     .subscribe(data => {
  //       this.products = data;
  //     });
  // }

  getProductBySubcategoryID(): void {
    this.productService.getFireCloudProductsBySubcategoryID(this.currentSubcategory.id)
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
