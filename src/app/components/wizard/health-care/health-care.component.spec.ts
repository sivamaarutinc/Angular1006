import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { HealthCareComponent } from './health-care.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('HealthCareComponent', () => {
  let component: HealthCareComponent;
  let fixture: ComponentFixture<HealthCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthCareComponent ],
      imports: [HttpClientTestingModule,TranslateModule.forRoot(),ToastrModule.forRoot(),RouterTestingModule],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
