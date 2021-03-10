import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { AboutComponent } from './pages/about/about.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { ProductsComponent } from './pages/products/products.component';

// Admin
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { WrapperProductsComponent } from './pages/wrapper-products/wrapper-products.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';

// Guards
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: 'about', component: AboutComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'products/:category', component: ProductsComponent, children: [
      { path: ':subcategory', component: WrapperProductsComponent }
    ]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'category' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'subcategory', component: AdminSubcategoryComponent },
      { path: 'product', component: AdminProductComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
