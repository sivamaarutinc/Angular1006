import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthLogoutComponent } from './auth-logout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('AuthLogoutComponent', () => {
  let component: AuthLogoutComponent;
  let fixture: ComponentFixture<AuthLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLogoutComponent],
      imports: [RouterTestingModule,HttpClientTestingModule,ToastrModule.forRoot()],
      providers: [ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
