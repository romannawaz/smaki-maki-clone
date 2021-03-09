import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  currentProductPage: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.events
      .subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.currentProductPage = this.activatedRoute.snapshot.paramMap.get('name');
          console.log(this.currentProductPage);
        }
      });
  }

  ngOnInit(): void { }

}
