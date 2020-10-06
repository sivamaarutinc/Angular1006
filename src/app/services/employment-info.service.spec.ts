import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmploymentInfoService } from './employment-info.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('EmploymentInfoService', () => {
  let service: EmploymentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot(),TranslateModule.forRoot()],
      providers: [ToastrService,TranslateService]
    });
    service = TestBed.inject(EmploymentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
