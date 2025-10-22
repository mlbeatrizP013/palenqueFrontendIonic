import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoUserPage } from './estado-user.page';

describe('EstadoUserPage', () => {
  let component: EstadoUserPage;
  let fixture: ComponentFixture<EstadoUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
