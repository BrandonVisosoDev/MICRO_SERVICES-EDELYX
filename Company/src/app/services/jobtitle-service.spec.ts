import { TestBed } from '@angular/core/testing';
import { JobtitleService } from './jobtitle-service';

describe('JobtitleService', () => {
  let service: JobtitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobtitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
