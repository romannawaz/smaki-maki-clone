import { Component, OnInit } from '@angular/core';

import { ISubcategory } from 'src/app/shared/interfaces/subcategory.interface';
import { SubcategoryService } from 'src/app/shared/services/subcategory.service';

import { IType } from 'src/app/shared/interfaces/type.interface';
import { TypeService } from 'src/app/shared/services/type.service';
import { ProductType } from 'src/app/shared/models/product-type.model';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-type',
  templateUrl: './admin-type.component.html',
  styleUrls: ['./admin-type.component.scss']
})
export class AdminTypeComponent implements OnInit {

  subcategories: ISubcategory[] = [];
  types: IType[] = [];

  subcategoryID: string;
  name: string;

  constructor(
    private subcategoryService: SubcategoryService,
    private typeService: TypeService
  ) { }

  ngOnInit(): void {
    this.getSubcategories();
    this.getTypes();
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
      });
  }

  getTypes(): void {
    this.typeService.getFireCloudTypes()
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
        })
      )
      .subscribe(data => {
        this.types = data;
      });
  }

  addNewType(): void {
    let newType = new ProductType(this.subcategoryID, this.name);

    this.typeService.addFireCloudType(newType);
    console.log(newType);
  }

}
