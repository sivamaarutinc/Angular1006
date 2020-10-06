import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthCallbackComponent } from './auth-callback.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;
  class RouterStub {
    url = '';
    navigate(commands: any[], extras?: any) { }
}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCallbackComponent ],
      imports: [RouterTestingModule,BrowserAnimationsModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [ToastrService,{ provide: Router, useClass: RouterStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
