import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmploymentComponent } from './employment.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('EmploymentComponent', () => {
  let component: EmploymentComponent;
  let fixture: ComponentFixture<EmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmploymentComponent ],
      imports: [ToastrModule.forRoot(),HttpClientTestingModule,MatAutocompleteModule,NgIdleKeepaliveModule.forRoot(),TranslateModule.forRoot()],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
