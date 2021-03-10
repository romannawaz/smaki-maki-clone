import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperProductsComponent } from './wrapper-products.component';

describe('WrapperProductsComponent', () => {
  let component: WrapperProductsComponent;
  let fixture: ComponentFixture<WrapperProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
