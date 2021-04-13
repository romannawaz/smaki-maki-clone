import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { AboutComponent } from './pages/about/about.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { OrderComponent } from './pages/order/order.component';

// User
import { UserCabinetComponent } from './pages/user-cabinet/user-cabinet.component';
import { UserOrdersComponent } from './pages/user-cabinet/user-orders/user-orders.component';
import { UserProfileComponent } from './pages/user-cabinet/user-profile/user-profile.component';
import { UserTrackerComponent } from './pages/user-cabinet/user-tracker/user-tracker.component';

// Admin
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';
import { AdminTypeComponent } from './admin/admin-type/admin-type.component';
import { AdminVacanciesComponent } from './admin/admin-vacancies/admin-vacancies.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';

// Guards
import { AdminGuard } from './shared/guards/admin.guard';
import { UserGuard } from './shared/guards/user.guard';

import { VacanciesResolver } from './shared/resolves/vacancies.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'about' },
  { path: 'about', component: AboutComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'vacancies', component: VacanciesComponent, resolve: { vacancies: VacanciesResolver } },
  { path: 'order', component: OrderComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'products/:category', component: ProductsComponent, children: [
      { path: ':subcategory', component: ProductsListComponent }
    ]
  },
  { path: 'products/:category/:subcategory/:id', component: ProductDetailsComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'category' },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'subcategory', component: AdminSubcategoryComponent },
      { path: 'type', component: AdminTypeComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'vacancies', component: AdminVacanciesComponent },
      { path: 'discounts', component: AdminDiscountComponent }
    ]
  },
  {
    path: 'cabinet', component: UserCabinetComponent, canActivate: [UserGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'orders' },
      { path: 'orders', component: UserOrdersComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'tracker', component: UserTrackerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
