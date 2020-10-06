import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PastEmploymentInfoService } from './past-employment-info.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
describe('PastEmploymentInfoService', () => {
  let service: PastEmploymentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot(), TranslateModule.forRoot()],
      providers: [ToastrService,TranslateService]
    });
    service = TestBed.inject(PastEmploymentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
