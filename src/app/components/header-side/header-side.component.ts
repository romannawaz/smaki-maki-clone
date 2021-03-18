import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategoryService } from 'src/app/shared/services/category.service';

import { map } from 'rxjs/operators';
import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.component.html',
  styleUrls: ['./header-side.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderSideComponent implements OnInit {

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
}
