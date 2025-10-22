import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormExpPage } from './form-exp.page';

describe('FormExpPage', () => {
  let component: FormExpPage;
  let fixture: ComponentFixture<FormExpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
