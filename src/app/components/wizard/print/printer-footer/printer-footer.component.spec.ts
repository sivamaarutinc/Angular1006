import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterFooterComponent } from './printer-footer.component';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
describe('PrinterFooterComponent', () => {
  let component: PrinterFooterComponent;
  let fixture: ComponentFixture<PrinterFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterFooterComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
