import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalSignInComponent } from 'src/app/pages/modal-sign-in/modal-sign-in.component';

// Interafaces
import { ICategory } from 'src/app/shared/interfaces/category.interface';

// Services
import { CategoryService } from 'src/app/shared/services/category.service';

// Directives
import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

// rxjs
import { map } from 'rxjs/operators';

// Modal
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.component.html',
  styleUrls: ['./header-side.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderSideComponent implements OnInit {

  @Output() headerStatus = new EventEmitter<boolean>();

  categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  openSignInModal() {
    const dialogRef = this.dialog.open(ModalSignInComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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

  hideHeaderSide(): void {
    this.headerStatus.emit(true);
  }
}
