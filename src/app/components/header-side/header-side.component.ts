import { Component, OnInit, TemplateRef } from '@angular/core';

// Interafaces
import { ICategory } from 'src/app/shared/interfaces/category.interface';

// Services
import { CategoryService } from 'src/app/shared/services/category.service';

// Directives
import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

// rxjs
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.component.html',
  styleUrls: ['./header-side.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderSideComponent implements OnInit {

  categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  openDialog(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      width: '380px',
      panelClass: 'mat-dialog-wrapper'
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
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
