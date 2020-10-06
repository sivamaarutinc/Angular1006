import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthResumeCallbackComponent } from './auth-resume-callback.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('AuthResumeCallbackComponent', () => {
  let component: AuthResumeCallbackComponent;
  let fixture: ComponentFixture<AuthResumeCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,ToastrModule.forRoot()],
      declarations: [ AuthResumeCallbackComponent ],
      providers: [ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthResumeCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
