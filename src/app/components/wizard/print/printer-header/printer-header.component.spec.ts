import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { PrinterHeaderComponent } from './printer-header.component';
import { FieldErrorDisplayComponent } from 'src/app/components/field-error-display/field-error-display.component';
import { ToastrService,ToastrModule } from 'ngx-toastr';

describe('PrinterHeaderComponent', () => {
  let component: PrinterHeaderComponent;
  let fixture: ComponentFixture<PrinterHeaderComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterHeaderComponent,FieldErrorDisplayComponent ],
      imports: [TranslateModule.forRoot(),ToastrModule.forRoot()],
      providers: [TranslateService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
