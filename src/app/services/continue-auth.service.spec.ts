import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContinueAuthService } from './continue-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('ContinueAuthService', () => {
  let service: ContinueAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [ToastrService]
    });
    service = TestBed.inject(ContinueAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
