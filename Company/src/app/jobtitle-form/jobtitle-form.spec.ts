import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobtitleFormComponent } from './jobtitle-form';

describe('JobtitleFormComponent', () => {
  let component: JobtitleFormComponent;
  let fixture: ComponentFixture<JobtitleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobtitleFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobtitleFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
