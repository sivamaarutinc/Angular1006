import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA,MatDialogModule} from '@angular/material/dialog';
import { WizardComponent } from './wizard.component';
import { TranslateService,TranslateModule} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FieldErrorDisplayComponent } from '../field-error-display/field-error-display.component';
import { RouterTestingModule } from '@angular/router/testing';
describe('WizardComponent', () => {
  let component: WizardComponent;
  let fixture: ComponentFixture<WizardComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardComponent,FieldErrorDisplayComponent ],
      imports: [TranslateModule.forRoot(),RouterTestingModule,MatAutocompleteModule,HttpClientTestingModule,MatDialogModule],
      providers: [TranslateService,{
        provide: MatDialogRef,
        useValue: mockDialogRef
      }, { provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
