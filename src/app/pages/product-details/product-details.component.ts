import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  currentProductID: string;

  categoryUrl: string;
  subcategoryUrl: string;

  subcategoryName: string;

  linkBack: string;

  product: IProduct;

  constructor(
    private subcategoryService: SubcategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.currentProductID = this.activatedRoute.snapshot.paramMap.get('id');

          this.subcategoryUrl = this.activatedRoute.snapshot.paramMap.get('subcategory');
          this.categoryUrl = this.activatedRoute.snapshot.paramMap.get('category');

          this.subcategoryService.getFireCloudSubcategoryByUrlName(this.subcategoryUrl)
            .snapshotChanges()
            .pipe(
              map(changes => changes.map(subcategory => ({ name: subcategory.payload.doc.data().name })))
            ).
            subscribe(name => {
              this.subcategoryName = name[0].name;
            });

          this.linkBack = `/products/${this.categoryUrl}/${this.subcategoryUrl}`;

          this.getProductByID();
        }
      });
  }

  ngOnInit(): void { }

  getProductByID(): void {
    this.productService.getFireCloudProductByID(this.currentProductID)
      .get()
      .pipe(
        map(changes => ({ id: changes.id, ...changes.data() }))
      )
      .subscribe(data => {
        this.product = data;
      })
  }
}
