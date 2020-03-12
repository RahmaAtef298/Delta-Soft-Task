import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks-service.service';

describe('TasksServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TasksService = TestBed.get(TasksService);
    expect(service).toBeTruthy();
  });
});
