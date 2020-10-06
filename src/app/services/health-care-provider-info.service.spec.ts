import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HealthCareProviderInfoService } from './health-care-provider-info.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('HealthCareProviderInfoService', () => {
  let service: HealthCareProviderInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot(),TranslateModule.forRoot()],
      providers: [ToastrService,TranslateService]
    });
    service = TestBed.inject(HealthCareProviderInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
