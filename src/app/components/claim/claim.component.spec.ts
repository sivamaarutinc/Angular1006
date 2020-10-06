import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClaimComponent } from './claim.component';
import { ClaimService } from 'src/app/services/claim.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationService } from 'src/app/services/validation.service';
import { TimeoutService } from 'src/app/services/timeout.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FieldErrorDisplayComponent } from '../field-error-display/field-error-display.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('ClaimComponent', () => {
  let component: ClaimComponent;
  let fixture: ComponentFixture<ClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimComponent, FooterComponent, HeaderComponent, FieldErrorDisplayComponent],
      imports: [ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, NgIdleKeepaliveModule.forRoot(),
      TranslateModule.forRoot(),
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [ClaimService, TimeoutService, ValidationService, TranslateService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created', () => {
    const service: ClaimService = TestBed.inject(ClaimService);
    expect(service).toBeTruthy();
  });

  it('should have getData function', () => {
    const service: ClaimService = TestBed.inject(ClaimService);
    expect(service.createClaim).toBeTruthy();
  });
});
