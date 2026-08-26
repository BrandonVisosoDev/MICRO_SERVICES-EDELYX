import { TestBed } from '@angular/core/testing';
import { JobTitle } from '../models/jobTitles.model';

describe('JobTitle', () => {
  let model: JobTitle;

  beforeEach(() => {
    model = { jobTitleId: 1, jobTitle: 'Analista' };
  });

  it('should be created with valid shape', () => {
    expect(model).toBeTruthy();
    expect(model.jobTitle).toBe('Analista');
  });
});
