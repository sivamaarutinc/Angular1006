import { TestBed } from '@angular/core/testing';

import { SupportingDocumentsService } from './supporting-documents.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

describe('SupportingDocumentsService', () => {
  let service: SupportingDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ToastrModule.forRoot(),TranslateModule.forRoot()],
      providers: [ToastrService,TranslateService]
    });
    service = TestBed.inject(SupportingDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
