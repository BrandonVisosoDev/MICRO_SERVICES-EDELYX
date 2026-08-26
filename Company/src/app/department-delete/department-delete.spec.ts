import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentDelete } from './department-delete';

describe('DepartmentDelete', () => {
  let component: DepartmentDelete;
  let fixture: ComponentFixture<DepartmentDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
