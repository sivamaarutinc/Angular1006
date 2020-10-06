import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ConfirmationComponent } from './confirmation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ],
      imports: [NgIdleKeepaliveModule.forRoot(),TranslateModule.forRoot(),HttpClientTestingModule,RouterTestingModule],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
