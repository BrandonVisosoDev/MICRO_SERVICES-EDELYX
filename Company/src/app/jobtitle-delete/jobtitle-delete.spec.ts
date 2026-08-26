import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobtitleDeleteComponent } from './jobtitle-delete';

describe('JobtitleDeleteComponent', () => {
  let component: JobtitleDeleteComponent;
  let fixture: ComponentFixture<JobtitleDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobtitleDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobtitleDeleteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
