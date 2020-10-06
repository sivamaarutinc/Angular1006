import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { AddEmployerModalComponent } from './add-employer-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('AddEmployerModalComponent', () => {
  let component: AddEmployerModalComponent;
  let fixture: ComponentFixture<AddEmployerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployerModalComponent ],
      imports: [HttpClientTestingModule,ToastrModule.forRoot(),TranslateModule.forRoot(),MatAutocompleteModule],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
