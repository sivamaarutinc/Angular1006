import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReviewComponent } from './review.component';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { FieldErrorDisplayComponent } from '../../field-error-display/field-error-display.component';
import { YesNoPipe } from '../../pipes/yes-no.pipe';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewComponent,FieldErrorDisplayComponent,YesNoPipe ],
      imports: [HttpClientTestingModule,TranslateModule.forRoot(),ToastrModule.forRoot()],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
