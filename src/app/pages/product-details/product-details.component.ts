import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Interfaces
import { IProduct } from 'src/app/shared/interfaces/product.interface';

// Services
import { ProductService } from 'src/app/shared/services/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

// rxjs operators
import { map } from 'rxjs/operators';

// Swiper
import SwiperCore, {
  Navigation,
  Scrollbar,
  A11y,
} from 'swiper/core';

SwiperCore.use([Navigation, Scrollbar, A11y]);

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

  recommendedProducts: IProduct[] = [];

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

        this.getRecommendedProducts();
      })
  }

  getRecommendedProducts(): void {
    this.productService.getFireCloudProductsByCategoryID(this.product.categoryID)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
      )
      .subscribe(data => {
        this.recommendedProducts = data.filter(product => product.id != this.product.id);
        console.log(this.recommendedProducts);
      })
  }
}
