import { TestBed } from '@angular/core/testing';

import { ReferenceNumberInterceptor } from './reference-number.interceptor';

describe('ReferenceNumberInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ReferenceNumberInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ReferenceNumberInterceptor = TestBed.inject(ReferenceNumberInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
