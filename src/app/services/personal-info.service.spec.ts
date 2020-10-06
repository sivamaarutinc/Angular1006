import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PersonalInfoService } from './personal-info.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
describe('PersonalInfoService', () => {
  let service: PersonalInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot(),TranslateModule.forRoot()],
      providers: [ToastrService,TranslateService]
    });
    service = TestBed.inject(PersonalInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
