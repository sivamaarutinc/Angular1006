import { TestBed } from '@angular/core/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TimeoutService } from './timeout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
describe('TimeoutService', () => {
  let service: TimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgIdleKeepaliveModule.forRoot(),HttpClientTestingModule,RouterTestingModule,TranslateModule.forRoot()],
      providers: [TranslateService]
    });
    service = TestBed.inject(TimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
