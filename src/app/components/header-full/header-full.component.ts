import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { CategoryService } from 'src/app/shared/services/category.service';

import { map } from 'rxjs/operators';
import { ICategory } from 'src/app/shared/interfaces/category.interface';

@Component({
  selector: 'app-header-full',
  templateUrl: './header-full.component.html',
  styleUrls: ['./header-full.component.scss']
})
export class HeaderFullComponent implements OnInit {

  @Output() headerStatus = new EventEmitter<boolean>();

  categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getFireCloudCategories()
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({ id: c.payload.doc.id, ...c.payload.doc.data() }));
        })
      )
      .subscribe(data => {
        this.categories = data;
      });
  }

  closeFullSizeHeader(): void {
    this.headerStatus.emit(false);
  }

}
