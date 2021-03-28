import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';

// Model
import { Product } from 'src/app/shared/models/product.model';

// Intefaces
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { IType } from 'src/app/shared/interfaces/type.interface';

// Services
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';
import { TypeService } from 'src/app/shared/services/type.service';

// rsjx operators
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  displayedColumns: string[] = ['name', 'discount', 'price', 'weight', 'description', 'update', 'delete'];

  name: string;
  discount: string;
  price: string;
  weight: string;
  description: string;

  categories: ICategory[] = [];
  categoryID: string;

  subcategories: ISubcategory[] = [];
  subcategoryID: string;

  types: IType[] = [];
  typesID = new FormControl();

  fileInputSmallImage: File;
  fileInputBigImage: File;

  pathToSmallImage: string;
  pathToBigImage: string;

  uploadPercentSmallImage: Observable<number>;
  uploadPercentBigImage: Observable<number>;

  products: IProduct[] = [];

  updateProductID: string;
  updateStatus: boolean;

  constructor(
    private storage: AngularFireStorage,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private typeService: TypeService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getCategories();

    this.getProducts();
  }

  resetForm(): void {
    this.name = null;
    this.discount = null;
    this.price = null;
    this.weight = null;
    this.description = null;

    this.categoryID = null;
    this.subcategoryID = null;
    this.typesID.setValue(null);

    this.fileInputSmallImage = null;
    this.fileInputBigImage = null;
  }
  
  getCategories(): void {
    this.categoryService.getFireCloudCategories()
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(cat => ({ id: cat.payload.doc.id, ...cat.payload.doc.data() })))
      )
      .subscribe(data => {
        this.categories = data;
      });
  }

  getSubcategories(): void {
    this.types = null;

    this.subcategoryService.getFireCloudSubcategoriesByCategoryID(this.categoryID)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(subcat => ({ id: subcat.payload.doc.id, ...subcat.payload.doc.data() })))
      )
      .subscribe(data => {
        this.subcategories = data;
      });
  }

  getTypes(): void {
    this.typeService.getFireCloudTypesBySubcategoryID(this.subcategoryID)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(type => ({ id: type.payload.doc.id, ...type.payload.doc.data() })))
      )
      .subscribe(data => {
        this.types = data;
      })
  }

  uploadFile($event, folder: string): void {
    const file = $event.target.files[0];

    const filePath = `${folder}/${file.name}`;
    const ref = this.storage.ref(filePath);

    const task = ref.put(file);

    let fileSize = folder.split('/')[1];

    if (fileSize == 'small') {
      this.uploadPercentSmallImage = task.percentageChanges();
    }
    else if (fileSize == 'big') {
      this.uploadPercentBigImage = task.percentageChanges();
    }
    task.then(image => {
      this.storage.ref(`${folder}/${image.metadata.name}`)
        .getDownloadURL()
        .subscribe(url => {
          if (fileSize == 'small') {
            this.pathToSmallImage = url;
          }
          else if (fileSize == 'big') {
            this.pathToBigImage = url;
          }
        });
    });
  }

  getProducts(): void {
    this.productService.getFireCloudProducts()
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(product => ({ id: product.payload.doc.id, ...product.payload.doc.data() })))
      )
      .subscribe(data => {
        this.products = data;
      })
  }

  updateProduct(product: IProduct): void {
    let { id, image, imageDetails, categoryID, name, discount, price, weight, description, subcategoryID, typesID } = product;

    this.pathToSmallImage = image;
    this.pathToBigImage = imageDetails;
    this.name = name;
    this.discount = discount;
    this.price = price;
    this.weight = weight;
    this.description = description;

    this.categoryID = categoryID;
    this.subcategoryID = subcategoryID;
    this.typesID.setValue(typesID);

    this.updateProductID = id;
    this.updateStatus = true;

    this.getSubcategories();
    this.getTypes();
  }

  deleteProduct(id: string): void {
    this.productService.deleteFireCloudProduct(id)
      .then(() => this.getProducts())
      .catch(error => console.log(error));
  }

  // -------------------

  addNewProduct(): void {
    let newProduct = new Product(
      this.categoryID,
      this.pathToSmallImage,
      this.pathToBigImage,
      this.name,
      this.price,
      this.weight,
      this.description,
      this.discount,
      this.subcategoryID,
      this.typesID.value
    );

    if (!this.updateStatus) {
      this.productService.addFireCloudProduct(newProduct)
        .then(() => console.log('product added success'))
        .catch(error => console.log(error));
    }
    else {
      this.productService.updateFireCloudProduct(this.updateProductID, newProduct)
        .then(() => this.getProducts())
        .catch(error => console.log(error));
    }

    this.resetForm();
  }

}
