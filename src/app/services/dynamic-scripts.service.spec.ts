import { TestBed } from '@angular/core/testing';

import { DynamicScriptsService } from './dynamic-scripts.service';

describe('DynamicScriptsService', () => {
  let service: DynamicScriptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicScriptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
