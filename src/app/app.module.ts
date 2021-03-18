import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';

// Components
import { HeaderTopComponent } from './components/header-top/header-top.component';
import { HeaderSideComponent } from './components/header-side/header-side.component';

// Pages
import { AboutComponent } from './pages/about/about.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { CurrentDiscountComponent } from './pages/current-discount/current-discount.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

// Admin
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';
import { AdminTypeComponent } from './admin/admin-type/admin-type.component';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollDirective } from './shared/directives/scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderTopComponent,
    HeaderSideComponent,
    AboutComponent,
    DeliveryComponent,
    DiscountComponent,
    VacanciesComponent,
    CurrentDiscountComponent,
    AdminLoginComponent,
    AdminComponent,
    AdminProductComponent,
    AdminCategoryComponent,
    AdminSubcategoryComponent,
    ProductsComponent,
    AdminTypeComponent,
    FooterComponent,
    ProductDetailsComponent,
    ProductsListComponent,
    ScrollDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatTableModule,
    MatSelectModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
