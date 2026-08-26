import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobtitlesComponent } from './jobtitles';

describe('JobtitlesComponent', () => {
  let component: JobtitlesComponent;
  let fixture: ComponentFixture<JobtitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobtitlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobtitlesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
