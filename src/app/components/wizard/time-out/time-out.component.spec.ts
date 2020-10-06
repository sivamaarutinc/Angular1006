import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { TimeOutComponent } from './time-out.component';

describe('TimeOutComponent', () => {
  let component: TimeOutComponent;
  let fixture: ComponentFixture<TimeOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOutComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
