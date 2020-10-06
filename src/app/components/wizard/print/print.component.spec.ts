import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PrintComponent } from './print.component';

describe('PrintComponent', () => {
  let component: PrintComponent;
  let fixture: ComponentFixture<PrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintComponent ],
      imports: [TranslateModule.forRoot(),HttpClientTestingModule],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
