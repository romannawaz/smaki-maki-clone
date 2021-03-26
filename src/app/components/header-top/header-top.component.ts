import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ScrollDirective } from 'src/app/shared/directives/scroll.directive';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
  viewProviders: [ScrollDirective]
})
export class HeaderTopComponent implements OnInit {

  @Output() headerStatus = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }

  closeFullSizeHeader(): void {
    this.headerStatus.emit(false);
  }

}
