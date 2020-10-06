import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,TranslateModule.forRoot(),ToastrModule.forRoot()],
      providers: [TranslateService,ToastrService]
    });
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
