import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SupportingDocumentsComponent } from './supporting-documents.component';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('SupportingDocumentsComponent', () => {
  let component: SupportingDocumentsComponent;
  let fixture: ComponentFixture<SupportingDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportingDocumentsComponent ],
      imports: [HttpClientTestingModule,TranslateModule.forRoot(),ToastrModule.forRoot()],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
