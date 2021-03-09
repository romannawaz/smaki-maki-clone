import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-discount',
  templateUrl: './current-discount.component.html',
  styleUrls: ['./current-discount.component.scss']
})
export class CurrentDiscountComponent implements OnInit {

  isCollapsed: boolean = true;

  constructor() { }

  ngOnInit(): void { }

}
