import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyInformationComponent } from './my-information.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { TimeoutService } from 'src/app/services/timeout.service';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('MyInformationComponent', () => {
  let component: MyInformationComponent;
  let fixture: ComponentFixture<MyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInformationComponent ],
      imports: [HttpClientTestingModule,NgIdleKeepaliveModule.forRoot(),ToastrModule.forRoot(),RouterTestingModule,TranslateModule.forRoot()],
      providers: [TranslateService,TimeoutService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
